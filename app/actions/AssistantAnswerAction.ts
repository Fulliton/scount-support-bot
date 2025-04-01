import Action from "@bootstrap/actions/Action";
import TelegramBot from "node-telegram-bot-api";
import Middleware from "@bootstrap/decorators/Middleware";
import Message from "@bootstrap/decorators/Message";
import ChatRepository from "@app/repositories/ChatRepository";
import {Thread} from "openai/resources/beta/threads";
import gptService from "@app/services/openai/GptService";
import gptMessageState from "@app/states/GptMessageState";
import SendMessageOptions from "@utils/Telegram/SendMessageOptions";
import InlineKeyboardMarkup from "@utils/Telegram/InlineKeyboardMarkup";
import InlineKeyboardButton from "@utils/Telegram/InlineKeyboardButton";
import CallbackEnum from "@app/enums/CallbackEnum";
import {Assistant} from "openai/resources/beta/assistants";
import chatState from "@app/states/ChatState";
import StateEnum from "@app/enums/StateEnum";
import StateMiddleware from "@middlewares/StateMiddleware";
import {StartCreateTobacco} from "@actions/CreateTobaccoActions";

@Middleware(StateMiddleware, [StateEnum.ASSISTANT])
@Message()
export default class GptAction extends Action{
    async handle(message: TelegramBot.Message): Promise<void> {

       const lastMessageId = gptMessageState.getState(this._getChatId(message))

        if (lastMessageId)
            await this.clearKeyBoard(lastMessageId)

        let loadingMessage = await this._send(
            "...",
            this._getChatId(message)
        )
        let dots = 3;

        const chatRepository = new ChatRepository();

        let chat = await chatRepository.firstOrCreate(message.chat.id)

        if(chat.thread_id === null) {
            const thread: Thread = await gptService.createThread()
            chat = await chatRepository.saveThreadId(chat, thread.id)
        }

        if(chat.assistant_id === null) {
            const assistant: Assistant = await gptService.createAssistant(chat.chat_id.toString())
            chat = await chatRepository.saveAssistant(chat, assistant.id)
        }

        let interval = setInterval(() => {
            dots = dots + 1
            this._bot.editMessageText(
                '.'.repeat(dots),
                {
                    chat_id: this._getChatId(loadingMessage),
                    message_id: loadingMessage.message_id
                }
            )

            if (dots > 5) {
                dots = 2
            }
        }, 1000)


        const answer = await gptService.complete(chat.assistant_id, chat.thread_id, message.text);

        clearInterval(interval);
        interval = null


        await this._delete(this._getChatId(message), loadingMessage)

        if (answer) {
            console.log('Answer', answer)

            if (answer.total_tokens > 6000) {
                answer.text += "\n\n🙋 Моя память не бесконечна. Я буду помнить всё что ты курил, но могу забыть твои вопросы ранее. 😽😽😽"

                await chatRepository.clearThreadId(chat)
            }

            if (answer.text === '/create_hookah') {
                await (new StartCreateTobacco()).handle(message)
            } else {
                const newLastMessage = await this._send(
                    answer.text,
                    message.chat.id,
                    SendMessageOptions.init()
                        .parseMode('Markdown')
                        .addInlineKeyboard(
                            InlineKeyboardMarkup.addButton(InlineKeyboardButton.create('🚪 Выйти из ассистента', CallbackEnum.STOP_ASSISTANT))
                        )
                )
                gptMessageState.setState(this._getChatId(newLastMessage), newLastMessage)
                chatState.setState(message.chat.id, StateEnum.ASSISTANT)
            }
        } else {
            await this._send('Упс, произошла ошибка', message.chat.id)
        }
    }
}