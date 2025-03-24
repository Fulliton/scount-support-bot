import AdminMiddleware from "@middleware/AdminMiddleware";

const {
    getState,
    clearState,
    ADMIN_STATES,
} = require('@states/userStates');

class CreateNotifyAllUserMiddleware extends AdminMiddleware
{
    async handle() {
        return super.handle()
            .then(result => {
                console.log(result);
                if (result) {
                    const currentState = getState(this.message.chat.id)

                    if (currentState === ADMIN_STATES.SEND_ALL && this.message.text) {
                        clearState(this.message.chat.id);
                        return true;
                    }
                }
                return false;
            })
            .catch(() => {
                return false
            })
    }
}

module.exports = CreateNotifyAllUserMiddleware;