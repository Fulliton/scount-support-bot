import AbstractMiddleware from "../../helpers/AbstractMiddleware.js"
import userState from "../../states/UserState.js";
import { COMMAND_STATES } from "../../states/SystemStates.js";

export default class CreateSynthesisActionMiddleware extends AbstractMiddleware
{
    async handle() {
        const currentState = userState.getState(this.message.chat.id)

        if (currentState === COMMAND_STATES.SPEAK && this.message.text) {
            userState.clearState(this.message.chat.id)
            return Promise.resolve(true)
        }

        return Promise.resolve(false)
    }
}