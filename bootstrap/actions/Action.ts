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

    protected async _send(
        text: string,
        chat_id: number,
        options: TelegramBot.SendMessageOptions|undefined = undefined
    ): Promise<TelegramBot.Message> {
        return await this._bot.sendMessage(
            chat_id,
            text,
           options
        );
    }

    protected async clearKeyBoard(message: TelegramBot.Message): Promise<void> {
        try {
            if (message?.reply_markup?.inline_keyboard?.length)
                await this._bot.editMessageReplyMarkup(
                    {inline_keyboard: []}, // пустая клавиатура
                    {chat_id: message.chat.id, message_id: message.message_id}
                );
        } catch (e) {}
    }
}