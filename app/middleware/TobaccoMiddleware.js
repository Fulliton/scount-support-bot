import AbstractMiddleware from "@bootstrap/AbstractMiddleware";
const {
    getState,
    clearState,
    COMMAND_STATES
} = require('@states/userStates');

class TobaccoMiddleware extends AbstractMiddleware
{
    async handle() {
        const currentState = getState(this.message.chat.id)

        if (currentState === COMMAND_STATES.TOBACCO && this.message.text) {
            clearState(this.message.chat.id);
            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }
}

module.exports = TobaccoMiddleware;