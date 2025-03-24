const AbstractAction = require('@bootstrap/AbstractAction');
const { Command } = require('@decorators/Command');
const Log = require('@helpers/Log');

@Command(/\/start/)
@Command(/\/help/)
class StartAction extends AbstractAction {

    handle() {
        this._send(
            "👋 Привет! Я — твой умный голосовой ассистент.\n" +
            "Вот что я умею:\n\n" +
            "🎙️ Голос → Текст\n" +
            "Отправь мне голосовое сообщение — я переведу его в текст.\n\n" +
            "📝 Текст → Голос\n" +
            "Хочешь услышать, как звучит твой текст? Просто пришли его — я озвучу!\n" +
            "Просто отправь мне: /speak и я попрошу его написать\n\n" +
            "🧠 Ответы на сложные вопросы\n" +
            "Есть идея, проблема или просто любопытство? Задай вопрос — постараюсь удивить ответом.",
            true
        )
            .catch(error => Log.error('Ошибка приветствия', error));
    }
}

module.exports = StartAction;