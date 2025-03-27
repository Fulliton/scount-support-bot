import AbstractMiddleware from "@middlewares/AbstractMiddleware";
import chatState from "@app/states/ChatState";
import TelegramBot from "node-telegram-bot-api";
import StateEnum from "@app/enums/StateEnum";
import CallbackEnum from "@app/enums/CallbackEnum";


export default class CheckAssistantStateMiddleware extends AbstractMiddleware{
    async handle(bot: TelegramBot, message: TelegramBot.Message): Promise<boolean> {
        const state: StateEnum = chatState.getState(message.chat.id)
        console.debug('CheckAssistantStateMiddleware')
        return state === StateEnum.ASSISTANT
            && !message.text.includes('/' + CallbackEnum.START_ASSISTANT)
            && message.chat.id > 0
            && !message.text.includes('/' + CallbackEnum.STOP_ASSISTANT)
    }
}