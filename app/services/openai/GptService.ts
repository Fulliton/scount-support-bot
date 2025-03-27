import { OpenAI } from 'openai';
import {ImageFileContentBlock, ImageURLContentBlock, RefusalContentBlock, Thread} from "openai/resources/beta/threads";
import {APIPromise, sleep} from "openai/core";
import {Assistant} from "openai/resources/beta/assistants";
import {TextContentBlock} from "openai/src/resources/beta/threads/messages";

export class GptService {

    _chat: OpenAI

    constructor() {
        this._chat = new OpenAI()
    }

    createThread(): APIPromise<Thread>
    {
        return this._chat.beta.threads.create();
    }

    createAssistant(): APIPromise<Assistant>
    {
        return this._chat.beta.assistants.create({
            instructions: "Ты кальянный ассистент. Помогай подбирать табак",
            name: "Hookah",
            model: "gpt-4o-mini"
        })
    }

    async complete(assistant_id: string, thread_id: string, text: string): Promise<ImageFileContentBlock | ImageURLContentBlock | TextContentBlock | RefusalContentBlock>
    {   const responseCreateMessage = await this._chat.beta.threads.messages.create(thread_id, {
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
            } catch (err) {console.log('Ожидаем выполнения')}

            await sleep(1000)
        } while (responseRetrieve?.status !== 'completed');

        console.log(responseRetrieve)

        const response = await this._chat.beta.threads.messages.list(thread_id)
        return  response.data[0].content[0]
        // console.log(content)
    }
}

const gptService = new GptService
export default gptService