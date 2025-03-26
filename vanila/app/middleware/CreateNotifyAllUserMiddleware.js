import AdminMiddleware from "vanila/app/middleware/AdminMiddleware.js"
import userState from '../../states/UserState.js'
import {ADMIN_STATES} from "../../states/SystemStates.js";

export default class CreateNotifyAllUserMiddleware extends AdminMiddleware
{
    async handle() {
        return super.handle()
            .then(result => {
                console.log(result)
                if (result) {
                    const currentState = userState.getState(this.message.chat.id)

                    if (currentState === ADMIN_STATES.SEND_ALL && this.message.text) {
                        userState.clearState(this.message.chat.id)
                        return true
                    }
                }
                return false
            })
            .catch(() => {
                return false
            })
    }
}