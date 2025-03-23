const AbstractAction = require('@actions/AbstractAction');

class SpeakAction extends AbstractAction {

    async handle() {
        const audio = await global.core.saluteSpeech.synthesis(this.message.text.replace('/speak', ''));

        if (audio) {
            await this.bot.sendAudio(this.message.chat.id, audio, { reply_to_message_id: this.message.message_id});
        } else {
            await this._send('❌ Ошибка генерации аудио. Возможно ты ничего не отправил', true);
        }
    }
}

module.exports = SpeakAction;