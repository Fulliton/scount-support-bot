import AbstractAction from "../../helpers/AbstractAction"
import { Command } from '../../decorators/Command'
import { setState, COMMAND_STATES } from '../../states/userStates';

@Command(/\/tobacco/)
export default class TobaccoCommand extends AbstractAction {

    async handle() {

        const chatId = this.message.chat.id;
        setState(chatId, COMMAND_STATES.TOBACCO);

        await this._send('Я смогу подобрать вам табак из ранее оставленных ваших отзывов:', true);
    }
}