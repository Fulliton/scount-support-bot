const AbstractAction = require('@bootstrap/AbstractAction');
const { Message } = require('@decorators/Message');
const TobaccoMiddleware = require('@middleware/TobaccoMiddleware');

@Message()
class AnswerTobaccoAction extends AbstractAction {

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

module.exports = AnswerTobaccoAction;