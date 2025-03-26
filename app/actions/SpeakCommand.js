import AbstractAction from "../../helpers/AbstractAction.js"
import { Command } from '../../decorators/Command.js'
import userState from "../../states/UserState.js";
import {COMMAND_STATES} from "../../states/SystemStates.js";

@Command(/\/speak/)
export default class SpeakCommand extends AbstractAction {

    async handle() {

        const chatId = this.message.chat.id;
        userState.setState(chatId, COMMAND_STATES.SPEAK);

        await this._send('Введите текст для озвучивания:', true);
    }
}