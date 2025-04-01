import Command from "@decorators/Command";
import Action from "@actions/Action";
import {Message} from "node-telegram-bot-api";
import chatState from "@app/states/ChatState";
import StateEnum from "@app/enums/StateEnum";
import Callback from "@decorators/Callback";
import CallbackEnum from "@app/enums/CallbackEnum";
import SendMessageOptions from "@utils/Telegram/SendMessageOptions";
import InlineKeyboardMarkup from "@utils/Telegram/InlineKeyboardMarkup";
import InlineKeyboardButton from "@utils/Telegram/InlineKeyboardButton";
import gptMessageState from "@app/states/GptMessageState";

@Callback(CallbackEnum.START_ASSISTANT)
@Command(/^\/start_assistant$/)
export default class StartAssistantAction extends Action{
    async handle(message: Message): Promise<void> {

        await this.clearKeyBoard(message)

        chatState.setState(this._getChatId(message), StateEnum.ASSISTANT)
        const lastMessage = await this._send(
            "Привет. Я твой кальянный консультант. Задай вопрос и Я отвечу",
            this._getChatId(message),
            SendMessageOptions.init()
                .addInlineKeyboard(
                    InlineKeyboardMarkup.addButton(InlineKeyboardButton.create('🚪 Выйти из ассистента', CallbackEnum.STOP_ASSISTANT))
                        .addButton(InlineKeyboardButton.create('Запомнить покур', CallbackEnum.CREATE_TOBACCO))
                )
        )
        gptMessageState.setState(this._getChatId(lastMessage), lastMessage)
    }
}