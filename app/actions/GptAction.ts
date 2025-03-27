import Command from "@decorators/Command";
import Action from "@actions/Action";
import {Message} from "node-telegram-bot-api";
import chatState from "@app/states/ChatState";
import StateEnum from "@app/enums/StateEnum";

@Command(/\/gpt/)
export default class GptAction extends Action{
    async handle(message: Message): Promise<void> {
        if (message.chat.id > 0) {
            chatState.setState(this._getChatId(message), StateEnum.GPT)
            await this._send(
                "Привет. Я твой кальянный консультант. Задай вопрос и Я отвечу",
                this._getChatId(message),
                message.message_id
            )
        } else {
            // await this._send(
            //     "Извини, но Я не могу в группе общаться по кальянной теме",
            //     this._getChatId(message),
            //     message.message_id
            // )
        }

    }
}