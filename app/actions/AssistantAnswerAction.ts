import Action from "@actions/Action";
import TelegramBot from "node-telegram-bot-api";
import {Middleware} from "@decorators/Middleware";
import CheckAssistantStateMiddleware from "@middlewares/CheckAssistantStateMiddleware";
import Message from "@decorators/Message";
import ChatRepository from "@app/repositories/ChatRepository";
import {Thread} from "openai/resources/beta/threads";
import gptService from "@app/services/openai/GptService";
import AssistantRepository from "@app/repositories/AssistantRepository";
import gptMessageState from "@app/states/GptMessageState";
import SendMessageOptions from "@utils/Telegram/SendMessageOptions";
import InlineKeyboardMarkup from "@utils/Telegram/InlineKeyboardMarkup";
import InlineKeyboardButton from "@utils/Telegram/InlineKeyboardButton";
import CallbackEnum from "@app/enums/CallbackEnum";

@Middleware(CheckAssistantStateMiddleware)
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
        const assistantRepository = new AssistantRepository();

        let chat = await chatRepository.firstOrCreate(message.chat.id)

        if(chat.thread_id === null) {
            const thread: Thread = await gptService.createThread()
            chat = await chatRepository.saveThreadId(chat, thread.id)
        }

        let assistant = await assistantRepository.first()

        if (assistant === null) {
            assistant = await assistantRepository.create(
                (await gptService.createAssistant()).id
            )
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


        const answer = await gptService.complete(assistant.assistant_id, chat.thread_id, message.text);

        clearInterval(interval);
        interval = null


        await this._delete(this._getChatId(message), loadingMessage)

        if (answer.type === 'text') {
            const text = answer.text.value;
            console.log('Ответ:', text);
            const newLastMessage = await this._send(
                text,
                this._getChatId(message),
                SendMessageOptions.init()
                    .parseMode('Markdown')
                    .addInlineKeyboard(
                        InlineKeyboardMarkup.addButton(InlineKeyboardButton.create('🚪 Выйти из ассистента', CallbackEnum.STOP_ASSISTANT))
                    )
            )
            gptMessageState.setState(this._getChatId(newLastMessage), newLastMessage)
        } else {
            console.error('Контент не текстовый:', answer)
        }
    }
}