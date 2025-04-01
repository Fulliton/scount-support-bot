import {ParseMode, InlineKeyboardMarkup, SendMessageOptions as TelegramMessageOptions} from 'node-telegram-bot-api'


export default class SendMessageOptions implements TelegramMessageOptions {
    parse_mode: ParseMode|undefined = undefined
    disable_web_page_preview: boolean|undefined = undefined
    reply_to_message_id: number|undefined = undefined
    reply_markup: InlineKeyboardMarkup|undefined = undefined

    static init(): SendMessageOptions  {
        return new SendMessageOptions()
    }

    parseMode(parse_mode: ParseMode) {
        this.parse_mode = parse_mode
        return this
    }

    addInlineKeyboard(keyboard: InlineKeyboardMarkup) {
        this.reply_markup = keyboard
        return this
    }
}