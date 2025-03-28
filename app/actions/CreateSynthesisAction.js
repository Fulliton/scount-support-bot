const { Readable } = require('stream');
const AbstractAction = require('@bootstrap/AbstractAction');
const { Message } = require('@decorators/Message');
const CreateSynthesisActionMiddleware = require('@middleware/CreateSynthesisActionMiddleware');


@Message()
class CreateSynthesisAction extends AbstractAction {

    static getMiddleware() {
        return CreateSynthesisActionMiddleware;
    }

    async handle() {
        const message = await this._send('⏱️ Начинаю обрабатывать, осталось подождать совсем немного...')
        try {
            const audio = await global.core.saluteSpeech.synthesis(this.message.text);
            await this._delete(message);
            try {
                if (audio) {
                    const stream = Readable.from(audio);
                    stream.path = 'new_voice_message.ogg';
                    await this.bot.sendAudio(
                        this.message.chat.id,
                        stream,
                        {reply_to_message_id: this.message.message_id},
                        {
                            filename: stream.path,
                            contentType: 'application/ogg',
                        }
                    );
                } else {
                    await this._send('❌ Ошибка генерации аудио. Возможно ты ничего не отправил', true);
                }
            } catch (error) {
                await this._send('❌ Произошла ошибка. Возможно текст был слишком длинный', true);
            }
        } catch (err) {
            await this._send('❌ Я не смогла получить от тебя сообщение. Попробуй ещё раз', true);
        }
    }
}

module.exports = CreateSynthesisAction;