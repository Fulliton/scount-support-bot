import Action from "@actions/Action";
import {Message} from "node-telegram-bot-api";
import chatState from "@app/states/ChatState";
import Callback from "@decorators/Callback";
import CallbackEnum from "@app/enums/CallbackEnum";
import Command from "@decorators/Command";

@Callback(CallbackEnum.STOP_ASSISTANT)
@Command(/^\/stop_assistant$/)
export default class StopAssistantAction extends Action{
    async handle(message: Message): Promise<void> {
        chatState.clearState(this._getChatId(message))
        await this.clearKeyBoard(message)
        await this._send(
            "Хорошо. Вы всегда можете обратиться ко мне отправив /" + CallbackEnum.START_ASSISTANT,
            this._getChatId(message),
        )
    }
}