import axios, { AxiosInstance } from "axios";
import { Agent } from "https";
import { v4 as uuidv4 } from "uuid";
import config from "@utils/config";

// Тип для получаемого токена
interface TokenResponse {
    access_token: string;
}

// Типы для ответа на запросы
interface RecognizeResponse {
    result: {
        id: string;
    };
}

interface StatusResponse {
    result: {
        response_file_id: string;
    };
}

interface ResultResponse {
    results: Array<{
        normalized_text: string;
    }>;
}

export class SaluteService {
    private token: string | null = null;
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: config("sberbank.host").toString(),
            timeout: 10000,
            httpsAgent: new Agent({
                rejectUnauthorized: false,
            }),
            headers: {
                RqUID: uuidv4(),
            },
        });

        // Интерцептор 401 — обновляем токен
        this.api.interceptors.response.use(
            (res) => res,
            async (error) => {
                if (error.response?.status === 401) {
                    console.info("SaluteSpeechService: ⛔ Токен истёк. Обновляем...");
                    await this.getAccessToken();
                    error.config.headers.Authorization = `Bearer ${this.token}`;
                    return this.api.request(error.config);
                }
                return Promise.reject(error);
            }
        );

        if (this.token === null || this.token === undefined) {
            this.getAccessToken().catch((err) =>
                console.error("SaluteSpeechService: Ошибка получения токена Сбербанк", err)
            );
        }
    }

    private async getAccessToken(): Promise<void> {
        const url = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth";
        const authHeader = "Bearer " + config("sberbank.client_secret");

        try {
            const res = await axios.post<TokenResponse>(url, {
                scope: config("sberbank.scopes"),
            }, {
                headers: {
                    Authorization: authHeader,
                    RqUID: uuidv4(),
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                httpsAgent: new Agent({
                    rejectUnauthorized: false,
                }),
            });

            this.token = res.data.access_token;
            this.api.defaults.headers.common.Authorization = `Bearer ${this.token}`;

            console.debug("SaluteSpeechService: ✅ Токен получен");
        } catch (error) {
            console.error("SaluteSpeechService: ❌ Ошибка при получении токена:", error.message);
            throw error;
        }
    }

    public async uploadAudio(buffer: Buffer): Promise<string> {
        const res = await this.api.post<{ result: { request_file_id: string } }>(
            "/data:upload",
            buffer,
            {
                headers: {
                    "Content-Type": "audio/ogg",
                    RqUID: uuidv4(),
                },
            }
        );

        const requestFileId = res.data.result.request_file_id;

        console.debug("SaluteSpeechService: 📤 Аудио отправлено. Request File ID:", requestFileId);
        return requestFileId;
    }

    public async recognize(requestFileId: string): Promise<string> {
        const res = await this.api.post<RecognizeResponse>("/speech:async_recognize", {
            options: {
                model: "general",
                audio_encoding: "OPUS",
                channels_count: 1,
            },
            request_file_id: requestFileId,
        });

        const taskId = res.data.result.id;

        console.debug("SaluteSpeechService: 📤 Распознавание аудио выполняется. Task ID:", taskId);
        return taskId;
    }

    public async status(taskId: string): Promise<string> {
        const res = await this.api.get<StatusResponse>(`/task:get?id=${taskId}`);

        const responseFileId = res.data.result.response_file_id;

        console.debug("SaluteSpeechService: 📤 Получили статус файла распознавания. Request File ID:", responseFileId);
        return responseFileId;
    }

    public async getResult(responseFileId: string): Promise<string> {
        const res = await this.api.get<ResultResponse[]>(`/data:download?response_file_id=${responseFileId}`);

        return res.data.map((item) => item.results[0].normalized_text).join(" ");
    }

    public async synthesis(text: string): Promise<Buffer | null> {
        try {
            const res = await this.api.post<ArrayBuffer>("/text:synthesize?format=opus&voice=Nec_24000", text, {
                responseType: "arraybuffer",
                headers: {
                    "Content-Type": "application/ssml",
                },
            });

            return Buffer.from(res.data);
        } catch (e) {
            console.error("SaluteSpeechService:  ❌ Ошибка генерации аудио");
            return null;
        }
    }
}

const saluteService = new SaluteService();
export default saluteService;
