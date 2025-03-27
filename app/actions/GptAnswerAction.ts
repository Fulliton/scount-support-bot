import Action from "@actions/Action";
import TelegramBot from "node-telegram-bot-api";
import {Middleware} from "@decorators/Middleware";
import CheckGptStateMiddleware from "@middlewares/CheckGptStateMiddleware";
import Message from "@decorators/Message";
import ChatRepository from "@app/repositories/ChatRepository";
import {Thread} from "openai/resources/beta/threads";
import gptService from "@app/services/openai/GptService";
import AssistantRepository from "@app/repositories/AssistantRepository";
import gptMessageState from "@app/states/GptMessageState";

@Middleware(CheckGptStateMiddleware)
@Message()
export default class GptAction extends Action{
    async handle(message: TelegramBot.Message): Promise<void> {

       const lastMessageId = gptMessageState.getState(this._getChatId(message))

        if (lastMessageId) {
            try {
                await this._bot.editMessageReplyMarkup(
                    {inline_keyboard: []}, // пустая клавиатура
                    {chat_id: this._getChatId(message), message_id: lastMessageId}
                );
            } catch (e) {}
        }

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
        }, 500)


        const answer = await gptService.complete(assistant.assistant_id, chat.thread_id, message.text);

        clearInterval(interval);
        interval = null


        await this._delete(this._getChatId(message), loadingMessage)

        if (answer.type === 'text') {
            const text = answer.text.value;
            console.log('Ответ:', text);
            const newLastMessage = await this._bot.sendMessage(this._getChatId(message), text, {
                parse_mode: 'Markdown',
                reply_markup: {

                    inline_keyboard: [
                        [{ text: '🚪 Выйти из ассистента', callback_data: 'exit_gpt' }],
                    ],
                },
            })
            gptMessageState.setState(this._getChatId(newLastMessage), newLastMessage.message_id)
        } else {
            console.error('Контент не текстовый:', answer)
        }
    }
}