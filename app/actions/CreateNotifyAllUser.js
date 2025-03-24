const AbstractAction = require('@bootstrap/AbstractAction');
const { Message } = require('@decorators/Message');
const CreateNotifyAllUserMiddleware = require('@middleware/CreateNotifyAllUserMiddleware');
const Chat = require('@models/Chat');

@Message()
class CreateNotifyAllUser extends AbstractAction {

    static getMiddleware() {
        return CreateNotifyAllUserMiddleware;
    }

    async handle() {
        const message = await this._send('⏱️ Ожидайте отправляем все клиентам...')
        try {
            const chats = await Chat.findAll()

            await chats.forEach((chat) => {
                this._send(this.message.text, false, chat.chat_id);
            })

            this._delete(message)
            this._send('Все сообщения доставлены');

        } catch (err) {
            this._send('Произошла ошибка доставки контента');
        }
    }
}

module.exports = CreateNotifyAllUser;