import Command from "@decorators/Command";
import Action from "@actions/Action";
import {Message} from "node-telegram-bot-api";
import InlineKeyboardMarkup from "@utils/Telegram/InlineKeyboardMarkup";
import InlineKeyboardButton from "@utils/Telegram/InlineKeyboardButton";
import SendMessageOptions from "@utils/Telegram/SendMessageOptions";
import CallbackEnum from "@app/enums/CallbackEnum";

@Command(/^\/start$/)
@Command(/^\/help$/)
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
            "🧠 Помочь с подбором така?\n" +
            "Я буду твоим личным ассистентом. Всегда помогу подобрать табак или микс. /" + CallbackEnum.START_ASSISTANT,
            this._getChatId(message),
            SendMessageOptions.init()
                .addInlineKeyboard(
                    InlineKeyboardMarkup.addButton(
                        InlineKeyboardButton.create('Вызвать Ассистента', CallbackEnum.START_ASSISTANT)
                    )
                        .addButton(
                            InlineKeyboardButton.create('Повтори за мной', CallbackEnum.SPEAK)
                        )
                )
        )
    }
}