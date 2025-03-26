import AbstractMiddleware from "../../helpers/AbstractMiddleware.js"
import { COMMAND_STATES } from "../../states/SystemStates.js";
import userState from "../../states/UserState.js";

export default class TobaccoMiddleware extends AbstractMiddleware
{
    async handle() {
        const currentState = userState.getState(this.message.chat.id)

        if (currentState === COMMAND_STATES.TOBACCO && this.message.text) {
            userState.clearState(this.message.chat.id)
            return Promise.resolve(true)
        }

        return Promise.resolve(false)
    }
}