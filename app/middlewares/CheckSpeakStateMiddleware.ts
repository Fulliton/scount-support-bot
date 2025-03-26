import AbstractMiddleware from "@middlewares/AbstractMiddleware";
import chatState from "@app/states/ChatState";
import TelegramBot from "node-telegram-bot-api";
import StateEnum from "@app/enums/StateEnum";


export default class CheckSpeakStateMiddleware extends AbstractMiddleware{
    async handle(bot: TelegramBot, message: TelegramBot.Message): Promise<boolean> {
        const state: StateEnum = chatState.getState(message.chat.id)
        console.debug('CheckSpeakStateMiddleware')
        if (state === StateEnum.SPEAK) {
            chatState.clearState(message.chat.id)
            return true
        }
        return false;
    }
}