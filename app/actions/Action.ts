import * as TelegramBot from "node-telegram-bot-api";
import ActionInterface from "@interfaces/ActionInterface";
import core from "@bootstrap/Core";



export default abstract class Action implements ActionInterface {

    _bot: TelegramBot;

    constructor() {
        this._bot = core.bot
    }

    abstract handle(message: TelegramBot.Message): Promise<void>

    _getChatId(message: TelegramBot.Message): number {
        return message.chat.id;
    }

    protected async _delete(chat_id: number, message: TelegramBot.Message|null): Promise<void> {
        if (message) {
            await this._bot.deleteMessage(chat_id, message.message_id);
        }
    }

    // this._delete(message)

    protected async _send(text: string, chat_id: number, reply: number|null = null): Promise<TelegramBot.Message> {
        return await this._bot.sendMessage(
            chat_id,
            text,
            reply ? {reply_to_message_id: reply} : {}
        );
    }
}