import AbstractMiddleware from "@bootstrap/AbstractMiddleware";
const {
    getState,
    clearState,
    SPEAK_STATES
} = require('@states/userStates');

class CreateSynthesisActionMiddleware extends AbstractMiddleware
{
    async handle() {
        const currentState = getState(this.message.chat.id)

        if (currentState === SPEAK_STATES.WAITING_TEXT && this.message.text) {
            clearState(this.message.chat.id);
            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }
}

module.exports = CreateSynthesisActionMiddleware;