import axios from "axios";
import { Agent } from "node:https";
import {v4 as uuidv4} from 'uuid'
import config from "../helpers/config.js";

class SaluteSpeechService {
    token = null;

    constructor() {
        this.api = axios.create({
            baseURL: config('sberbank.host'),
            timeout: 10000,
            httpsAgent: new Agent({
                rejectUnauthorized: false,
            }),
            headers: {
                RqUID: uuidv4()
            }
        });

        // Интерцептор 401 — обновляем токен
        this.api.interceptors.response.use(
            (res) => res,
            async (error) => {
                if (error.response?.status === 401) {
                    console.info('SaluteSpeechService: ⛔ Токен истёк. Обновляем...');
                    await this.getAccessToken();
                    error.config.headers.Authorization = `Bearer ${this.token}`;
                    return this.api.request(error.config);
                }
                return Promise.reject(error);
            }
        );

        if (this.token === null || this.token === undefined) {
            this.getAccessToken()
                .catch(err => console.error('SaluteSpeechService: Ошибка получения токена Сбербанк', err));
        }
    }

    async getAccessToken() {
        const url = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth';
        const authHeader = 'Bearer ' + config('sberbank.client_secret');

        try {
            const res = await axios.post(url, {
                scope: config('sberbank.scopes')
            }, {
                headers: {
                    Authorization: authHeader,
                    RqUID: uuidv4(),
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                httpsAgent: new Agent({
                    rejectUnauthorized: false,
                }),
            });

            this.token = res.data.access_token;
            this.api.defaults.headers.common.Authorization = `Bearer ${this.token}`;

            console.debug('SaluteSpeechService: ✅ Токен получен');
        } catch (error) {
            console.error('SaluteSpeechService: ❌ Ошибка при получении токена:', error.message);
            throw error;
        }
    }

    async uploadAudio(buffer) {
        const res = await this.api.post('/data:upload', buffer, {
            headers: {
                'Content-Type': 'audio/ogg',
                RqUID: uuidv4()
            },
        });

        const requestFileId = res.data.result.request_file_id;

        console.debug('SaluteSpeechService: 📤 Аудио отправлено. Request File ID:', requestFileId);
        return requestFileId;
    }

    async recognize(requestFileId) {
        const res = await this.api.post('/speech:async_recognize', {
            options: {
                model: "general",
                audio_encoding: "OPUS",
                channels_count: 1
            },
            request_file_id: requestFileId
        });

        const taskId = res.data.result.id;

        console.debug('SaluteSpeechService: 📤 Распознавание аудио выполняется.  Task ID:', taskId);
        return taskId;
    }

    async status(taskId) {
        const res = await this.api.get(`/task:get?id=${taskId}`);

        const responseFileId = res.data.result.response_file_id;

        console.debug('SaluteSpeechService: 📤 Получили статус файла распознования.  Request File ID:', responseFileId);
        return responseFileId;
    }

    async getResult(responseFileId) {
        const res = await this.api.get(`/data:download?response_file_id=${responseFileId}`);

        return res.data.map((item) => item.results[0].normalized_text).join(" ");
    }

    async synthesis(text) {
        try {
            const res = await this.api.post('/text:synthesize?format=opus&voice=Nec_24000', text, {
                responseType: 'arraybuffer',
                headers: {
                    'Content-Type': 'application/ssml',
                }
            });

            return Buffer.from(res.data, 'binary');
        } catch (e) {
            console.error('SaluteSpeechService:  ❌ Ошибка генерации аудио');
            return null;
        }

    }
}

const saluteSpeechService = new SaluteSpeechService();
export default saluteSpeechService;
