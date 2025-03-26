import AbstractAction from "../../helpers/AbstractAction"
import {Message} from '../../decorators/Message'
import TobaccoMiddleware from '../middleware/TobaccoMiddleware'

@Message()
export default class AnswerTobaccoAction extends AbstractAction {

    static getMiddleware() {
        return TobaccoMiddleware;
    }

    async handle() {
        const answer = await global.gigachatService.suggestTobacco(this.message.text)

        if (answer) {
            await this._send(answer, true);
        } else {
            await this._send('Ошибка генерации ответа', true);
        }
    }
}