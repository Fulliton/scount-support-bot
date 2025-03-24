const AbstractAction = require('@bootstrap/AbstractAction');
const { Command } = require('@decorators/Command');
const { setState, ADMIN_STATES } = require('@states/userStates');
import AdminMiddleware from "@middleware/AdminMiddleware";

@Command(/\/notify/)
class NotifyCommand extends AbstractAction {

    static getMiddleware() {
        return AdminMiddleware;
    }

    async handle() {
        await setState(this.message.chat.id, ADMIN_STATES.SEND_ALL);
        await this._send('Введите текст для массовой рассылки:', true);
    }
}

module.exports = NotifyCommand;