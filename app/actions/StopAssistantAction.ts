import Action from "@bootstrap/actions/Action";
import {Message} from "node-telegram-bot-api";
import chatState from "@app/states/ChatState";
import Callback from "@bootstrap/decorators/Callback";
import CallbackEnum from "@app/enums/CallbackEnum";
import Command from "@bootstrap/decorators/Command";
import SendMessageOptions from "@utils/Telegram/SendMessageOptions";
import InlineKeyboardMarkup from "@utils/Telegram/InlineKeyboardMarkup";
import InlineKeyboardButton from "@utils/Telegram/InlineKeyboardButton";

@Callback(CallbackEnum.STOP_ASSISTANT)
@Command(/^\/stop_assistant/)
export default class StopAssistantAction extends Action{
    async handle(message: Message): Promise<void> {
        chatState.clearState(this._getChatId(message))
        await this.clearKeyBoard(message)
        await this._send(
            "Хорошо. Вы всегда можете обратиться ко мне отправив /" + CallbackEnum.START_ASSISTANT,
            this._getChatId(message),
            SendMessageOptions.init()
                .addInlineKeyboard(
                    InlineKeyboardMarkup.addButton(
                        InlineKeyboardButton.create('Вызвать Ассистента', CallbackEnum.START_ASSISTANT)
                    )
                        .addButton( InlineKeyboardButton.create('Запомнить покур', CallbackEnum.CREATE_TOBACCO))
                )
        )
    }
}