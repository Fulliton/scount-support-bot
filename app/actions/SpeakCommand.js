const AbstractAction = require('@bootstrap/AbstractAction');
const { Command } = require('@decorators/Command');
const { setState, COMMAND_STATES } = require('@states/userStates');

@Command(/\/speak/)
class SpeakCommand extends AbstractAction {

    async handle() {

        const chatId = this.message.chat.id;
        setState(chatId, COMMAND_STATES.SPEAK);

        await this._send('Введите текст для озвучивания:', true);
    }
}

module.exports = SpeakCommand;