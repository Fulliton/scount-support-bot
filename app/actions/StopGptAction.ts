import Action from "@actions/Action";
import {Message} from "node-telegram-bot-api";
import chatState from "@app/states/ChatState";
import Callback from "@decorators/Callback";

@Callback('exit_gpt')
export default class StopGptAction extends Action{
    async handle(message: Message): Promise<void> {
        chatState.clearState(this._getChatId(message))
        await this._bot.editMessageReplyMarkup(
            { inline_keyboard: [] }, // пустая клавиатура
            { chat_id: this._getChatId(message), message_id: message.message_id }
        );
        await this._send(
            "Хорошо. Вы всегда можете обратиться ко мне отправив /gpt",
            this._getChatId(message),
        )
    }
}