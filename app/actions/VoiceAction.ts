import Action from "@actions/Action";
import {Message} from "node-telegram-bot-api";
import Voice from "@decorators/Voice";
import saluteService from "@app/services/SaluteService";

@Voice()
export default class VoiceAction extends Action{
    async handle(message: Message): Promise<void> {
        let lastMessage = await this._send(
            "👋Скачиваем ваше Аудио 😔",
            this._getChatId(message),
        )

        const stream = this._bot.getFileStream(message.voice.file_id);
        const chunks = [];

        for await (const chunk of stream) {
            chunks.push(chunk);
        }

        const buffer = Buffer.concat(chunks);
        await this._delete(this._getChatId(lastMessage), lastMessage)
        const requestFileId = await saluteService.uploadAudio(buffer)
        const taskId = await saluteService.recognize(requestFileId)
        let responseFileId = undefined
        lastMessage = null
        do {
            try {
                responseFileId = await saluteService.status(taskId)

                if (responseFileId === undefined) {
                    console.debug('VoiceAction: ожидаем проверку')

                    if (lastMessage === null) {
                        lastMessage = await this._send('Ожидайте обработка аудио 😔', this._getChatId(message));
                    }

                    await new Promise((resolve) => setTimeout(resolve, 1000)); // пауза 1 сек
                } else {
                    if (lastMessage)
                        await this._delete(this._getChatId(lastMessage), lastMessage);

                    const result = await saluteService.getResult(responseFileId)
                    await this._send(result, this._getChatId(message))
                }
            } catch (err) {
                console.error('❌ Ошибка в опросе:', err)
                await this._send('Ошибка при распознавании 😢', this._getChatId(message))
                break;
            }
        } while (responseFileId === undefined);

    }
}