import {OpenAI} from 'openai'
import {Thread} from "openai/resources/beta/threads"
import {APIPromise, sleep} from "openai/core"
import {Assistant} from "openai/resources/beta/assistants"
import Answer from "@app/services/openai/Answer"
import * as fs from "node:fs"
import config from '@lang/openai.json'

export class GptService {

    _chat: OpenAI

    constructor() {
        this._chat = new OpenAI()
    }

    createThread(): APIPromise<Thread> {
        return this._chat.beta.threads.create();
    }

    createAssistant(chat_id: string): APIPromise<Assistant> {
        return this._chat.beta.assistants.create({
            instructions: config.assistant_prompt,
            name: "Hookah_tg:" + chat_id,
            model: "gpt-4o-mini",
        })
    }

    createVectorStore(chat_id: string): Promise<OpenAI.VectorStore>
    {
        return this._chat.vectorStores.create({name: "Store_" + chat_id})
    }

    async complete(assistant_id: string, thread_id: string, text: string): Promise<Answer | null> {
        const responseCreateMessage = await this._chat.beta.threads.messages.create(thread_id, {
            role: 'user',
            content: text
        })
        const responseRun = await this._chat.beta.threads.runs.create(thread_id, {
            assistant_id: assistant_id,
        })

        let responseRetrieve = null;

        do {
            try {
                responseRetrieve = await this._chat.beta.threads.runs.retrieve(thread_id, responseRun.id)
                // console.log(responseRetrieve)
            } catch (err) {
                console.log('Ожидаем выполнения')
            }

            await sleep(2000)
        } while (responseRetrieve?.status !== 'completed');

        const response = await this._chat.beta.threads.messages.list(thread_id)

        if (response.data[0].content[0].type === "text") {
            return new Answer(
                response.data[0].content[0].text.value,
                responseRetrieve.usage.total_tokens,
                assistant_id,
                thread_id,
                responseRun.id
            )
        }

        return null;
    }

    async setFileInVectorStore(path: string, vector_store_id: string): Promise<void> {
        await this._chat.vectorStores.fileBatches.uploadAndPoll(vector_store_id, {files: [fs.createReadStream(path)]})
        console.log('✅ Добавили файл в Vector Store');
    }

    async deleteAllVectorFiles(vector_store_id: string): Promise<void> {
        try {
            // Получаем список всех файлов, прикреплённых к хранилищу векторов
            const files = await this._chat.vectorStores.files.list(vector_store_id);

            // Удаляем каждый файл
            for (const file of files.data) {
                console.log(`Удаляю файл ${file.id}...`);
                await this._chat.vectorStores.files.del(vector_store_id, file.id)
                    .then(() => {
                        this._chat.files.del(file.id)
                            .catch(err => console.error('Ошибка удаления файла ', file.id));
                    })
                    .catch(() => console.error('Ошибка удаления файла из Vector Storage'))
            }

            console.log('✅ Все файлы удалены из vector storage.');
        } catch (error) {
            console.error('Ошибка при удалении файлов:', error);
        }
    }

    async setVectorStoreInAssistant(assistant_id: string, vector_store_id: string): Promise<void>
    {
        await  this._chat.beta.assistants.update(assistant_id, {
            tool_resources:{file_search: {vector_store_ids: [vector_store_id]}},
            tools: [{type: "file_search"}]
        })
        console.log('✅ Привязали Vector Store к Assistant.');
    }
}

const gptService = new GptService
export default gptService