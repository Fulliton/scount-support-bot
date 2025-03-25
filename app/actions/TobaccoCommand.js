const AbstractAction = require('@bootstrap/AbstractAction');
const { Command } = require('@decorators/Command');
const { setState, COMMAND_STATES } = require('@states/userStates');

@Command(/\/tobacco/)
class TobaccoCommand extends AbstractAction {

    async handle() {

        const chatId = this.message.chat.id;
        setState(chatId, COMMAND_STATES.TOBACCO);

        await this._send('Я смогу подобрать вам табак из ранее оставленных ваших отзывов:', true);
    }
}

module.exports = TobaccoCommand;