import Command from "@decorators/Command";
import Action from "@actions/Action";
import {Message} from "node-telegram-bot-api";
import chatState from "@app/states/ChatState";
import StateEnum from "@app/enums/StateEnum";

@Command(/\/speak/)
export default class StartAction extends Action{
    async handle(message: Message): Promise<void> {
        chatState.setState(this._getChatId(message), StateEnum.SPEAK)
        await this._send(
            "Напиши мне текст и Я его озвучу",
            this._getChatId(message),
        )
    }
}