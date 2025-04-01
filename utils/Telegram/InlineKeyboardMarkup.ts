import {InlineKeyboardButton, InlineKeyboardMarkup as TelegramInlineKeyboardMarkup} from "node-telegram-bot-api";

export default class InlineKeyboardMarkup implements TelegramInlineKeyboardMarkup
{
    inline_keyboard: InlineKeyboardButton[][] = []

    static addButton(button: InlineKeyboardButton): InlineKeyboardMarkup {
        const ink = new InlineKeyboardMarkup()
        ink.addButton(button);
        return ink
    }

    addButton(button: InlineKeyboardButton): InlineKeyboardMarkup {
        this.inline_keyboard.push([button]);
        return this
    }
}