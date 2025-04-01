import Action from "@bootstrap/actions/Action";
import Middleware from "@bootstrap/decorators/Middleware";
import Message from "@bootstrap/decorators/Message";
import {Readable} from "stream";
import saluteService from "@app/services/SaluteService";
import TelegramBot from "node-telegram-bot-api";
import StateMiddleware from "@middlewares/StateMiddleware";
import StateEnum from "@app/enums/StateEnum";

@Middleware(StateMiddleware, [StateEnum.SPEAK])
@Message()
export default class GenerateAudioAction extends Action {

    lastMessage: TelegramBot.Message|null = null;

    async handle(message: TelegramBot.Message): Promise<void> {
        this.lastMessage = await this._send('⏱️ Начинаю обрабатывать, осталось подождать совсем немного...', this._getChatId(message))

        try {
            const audio = await saluteService.synthesis(message.text);
            await this._delete(this._getChatId(message), this.lastMessage);
            try {
                if (audio) {
                    const stream = Readable.from(audio);
                    await this._bot.sendAudio(
                        this._getChatId(message),
                        stream,
                        {reply_to_message_id: message.message_id},
                        {
                            filename: 'New_Voice_Bot.ogg',
                            contentType: 'application/ogg',
                        }
                    );
                } else {
                    await this._send('❌ Ошибка генерации аудио. Возможно ты ничего не отправил', this._getChatId(message));
                }
            } catch (error) {
                await this._send('❌ Произошла ошибка. Возможно текст был слишком длинный', this._getChatId(message));
            }
        } catch (err) {
            await this._send('❌ Я не смогла получить от тебя сообщение. Попробуй ещё раз', this._getChatId(message));
        }
    }

}