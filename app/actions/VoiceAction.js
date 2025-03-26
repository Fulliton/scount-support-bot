import AbstractAction from "../../helpers/AbstractAction.js"
import { Voice } from '../../decorators/Voice.js'
import { get } from "axios"
import saluteSpeechService from "../../services/SaluteSpeechService.js";

@Voice()
export default class VoiceAction extends AbstractAction {

    lastMessage = null;

    async handle() {
        this.lastMessage = await this._send(
            "👋Скачиваем ваше Аудио 😔",
            true
        )

        const fileInfo = await this.bot.getFile(this.message.voice.file_id)
        const filePath = fileInfo.file_path

        const url = `https://api.telegram.org/file/bot${this.bot.token}/${filePath}`
        const response = await get(url, {
            responseType: 'arraybuffer',
        });
        const buffer = Buffer.from(response.data);
        await this._delete(this.lastMessage)
        this.lastMessage = null;

        const requestFileId = await saluteSpeechService.uploadAudio(buffer)
        const taskId = await saluteSpeechService.recognize(requestFileId)
        let responseFileId;

        do {
            try {
                responseFileId = await saluteSpeechService.status(taskId)

                if (responseFileId === undefined) {
                    console.debug('VoiceAction: ожидаем проверку')

                    if (this.lastMessage === null) {
                        this.lastMessage = await this._send('Ожидайте обработка аудио 😔');
                    }

                    await new Promise((resolve) => setTimeout(resolve, 1000)); // пауза 1 сек
                } else {
                    if (this.lastMessage)
                        await this._delete(this.lastMessage);

                    const result = await saluteSpeechService.getResult(responseFileId)
                    await this._send(result)
                }
            } catch (err) {
                console.error('❌ Ошибка в опросе:', err)
                await this._send('Ошибка при распознавании 😢')
                break;
            }
        } while (responseFileId === undefined);

    }
}