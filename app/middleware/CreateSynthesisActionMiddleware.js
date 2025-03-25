import AbstractMiddleware from "@bootstrap/AbstractMiddleware";
const {
    getState,
    clearState,
    COMMAND_STATES
} = require('@states/userStates');

class CreateSynthesisActionMiddleware extends AbstractMiddleware
{
    async handle() {
        const currentState = getState(this.message.chat.id)

        if (currentState === COMMAND_STATES.SPEAK && this.message.text) {
            clearState(this.message.chat.id);
            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }
}

module.exports = CreateSynthesisActionMiddleware;