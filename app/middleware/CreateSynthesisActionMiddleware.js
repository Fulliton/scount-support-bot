import AbstractMiddleware from "@bootstrap/AbstractMiddleware";
const {
    getState,
    clearState,
    SPEAK_STATES
} = require('@states/userStates');

class CreateSynthesisActionMiddleware extends AbstractMiddleware
{
    handle() {
        const currentState = getState(this.message.chat.id)

        if (currentState === SPEAK_STATES.WAITING_TEXT && this.message.text) {
            clearState(this.message.chat.id);
            return true;
        }

        return false;
    }
}

module.exports = CreateSynthesisActionMiddleware;