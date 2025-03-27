import AbstractMiddleware from "@middlewares/AbstractMiddleware";
import chatState from "@app/states/ChatState";
import TelegramBot from "node-telegram-bot-api";
import StateEnum from "@app/enums/StateEnum";


export default class CheckGptStateMiddleware extends AbstractMiddleware{
    async handle(bot: TelegramBot, message: TelegramBot.Message): Promise<boolean> {
        const state: StateEnum = chatState.getState(message.chat.id)
        console.debug('CheckGptStateMiddleware')
        return state === StateEnum.GPT && message.text !== "/gpt" && message.text !== "/gpt@scount_support_bot" && message.chat.id > 0;

    }
}