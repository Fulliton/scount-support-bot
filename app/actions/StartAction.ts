import Command from "@decorators/Command";
import Action from "@actions/Action";
import {Message} from "node-telegram-bot-api";

@Command(/\/start/)
@Command(/\/help/)
export default class StartAction extends Action{
    async handle(message: Message): Promise<void> {
        await this._send(
            "👋 Привет! Я — твой умный голосовой ассистент.\n" +
            "Вот что я умею:\n\n" +
            "🎙️ Голос → Текст\n" +
            "Отправь мне голосовое сообщение — я переведу его в текст.\n\n" +
            "📝 Текст → Голос\n" +
            "Хочешь услышать, как звучит твой текст? Просто пришли его — я озвучу!\n" +
            "Просто отправь мне: /speak и я попрошу его написать\n\n" +
            "🧠 Ответы на сложные вопросы\n" +
            "Есть идея, проблема или просто любопытство? Задай вопрос — постараюсь удивить ответом.",
            this._getChatId(message),
            message.message_id
        )
    }
}