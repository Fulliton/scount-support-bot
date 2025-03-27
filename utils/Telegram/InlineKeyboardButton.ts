import {InlineKeyboardButton as TelegramInlineKeyboardButton} from "node-telegram-bot-api";

export default class InlineKeyboardButton implements TelegramInlineKeyboardButton {
    constructor(
        public text: string,
        public callback_data: string
    ) {}

    static create(text: string, callback_data: string): InlineKeyboardButton
    {
        return new InlineKeyboardButton(text, callback_data);
    }
}