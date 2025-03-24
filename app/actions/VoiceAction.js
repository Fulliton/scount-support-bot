const AbstractAction = require('@bootstrap/AbstractAction');
const { Voice } = require('@decorators/Voice');
const {get} = require("axios");

@Voice()
class VoiceAction extends AbstractAction {

    lastMessage = null;

    async handle() {
        this.lastMessage = await this._send(
            "👋Скачиваем ваше Аудио 😔",
            true
        );

        const fileInfo = await this.bot.getFile(this.message.voice.file_id);
        const filePath = fileInfo.file_path;

        const url = `https://api.telegram.org/file/bot${this.bot.token}/${filePath}`;
        const response = await get(url, {
            responseType: 'arraybuffer',
        });
        const buffer = Buffer.from(response.data);
        this._delete(this.lastMessage);
        this.lastMessage = null;

        const requestFileId = await global.core.saluteSpeech.uploadAudio(buffer);
        const taskId = await global.core.saluteSpeech.recognize(requestFileId);
        let responseFileId = null;

        const poll = async () => {
            try {
                responseFileId = await global.core.saluteSpeech.status(taskId);
                console.log('status response:', responseFileId);

                if (responseFileId === undefined) {
                    console.log('Ожидаем проверку');
                    if (this.lastMessage === null) {
                        this.lastMessage = await this._send('Ожидайте обработка аудио 😔');
                    }
                    // Повторить через 1 сек
                    setTimeout(poll, 1000);
                } else {
                    await this._delete(this.lastMessage);

                    const result = await global.core.saluteSpeech.getResult(responseFileId);
                    await this._send(result);
                }
            } catch (err) {
                console.error('❌ Ошибка в опросе:', err);
                await this._send('Ошибка при распознавании 😢');
            }
        };

        // Стартуем
        await poll();
    }
}

module.exports = VoiceAction;