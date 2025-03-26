import AbstractAction from "../../helpers/AbstractAction"
import {Message} from '../../decorators/Message'
import CreateNotifyAllUserMiddleware from '../middleware/CreateNotifyAllUserMiddleware';
import Chat from '../models/Chat';

@Message()
export default class CreateNotifyAllUser extends AbstractAction {

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

            await this._delete(message)
            await this._send('Все сообщения доставлены');

        } catch (err) {
            await this._send('Произошла ошибка доставки контента');
        }
    }
}