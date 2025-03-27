import Command from "@decorators/Command";
import Action from "@actions/Action";
import {Message} from "node-telegram-bot-api";
import chatState from "@app/states/ChatState";
import StateEnum from "@app/enums/StateEnum";
import CallbackEnum from "@app/enums/CallbackEnum";
import Callback from "@decorators/Callback";

@Callback(CallbackEnum.SPEAK)
@Command(/^\/speak$/)
export default class StartAction extends Action{
    async handle(message: Message): Promise<void> {
        chatState.setState(this._getChatId(message), StateEnum.SPEAK)
        await this.clearKeyBoard(message)
        await this._send(
            "Напиши мне текст и я его озвучу",
            this._getChatId(message),
        )
    }
}