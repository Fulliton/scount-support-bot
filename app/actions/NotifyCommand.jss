import AbstractAction from "../../helpers/AbstractAction"
import { Command } from '../../decorators/Command'
import { setState, ADMIN_STATES } from '../../states/userStates'
import AdminMiddleware from "../middleware/AdminMiddleware";

@Command(/\/notify/)
export default class NotifyCommand extends AbstractAction {

    static getMiddleware() {
        return AdminMiddleware;
    }

    async handle() {
        await setState(this.message.chat.id, ADMIN_STATES.SEND_ALL);
        await this._send('Введите текст для массовой рассылки:', true);
    }
}