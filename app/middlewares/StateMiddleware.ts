import chatState from "@app/states/ChatState";
import TelegramBot from "node-telegram-bot-api";
import StateEnum from "@app/enums/StateEnum";
import AbstractMiddleware from "@bootstrap/middleware/AbstractMiddleware";


export default class StateMiddleware extends AbstractMiddleware {

    constructor(
        private state: StateEnum
    ) {
        super()
    }

    async handle(bot: TelegramBot, message: TelegramBot.Message): Promise<boolean> {
        const state: StateEnum = chatState.getState(message.chat.id)
        console.debug('StateMiddleware')
        if(state === this.state) {
            chatState.clearState(message.chat.id)
            return true
        }

        return false
    }
}