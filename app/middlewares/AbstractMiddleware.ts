import TelegramBot from "node-telegram-bot-api";
import MiddlewareInterface from "@interfaces/MiddlewareInterface";

export default abstract class AbstractMiddleware implements MiddlewareInterface {
    abstract handle(bot: TelegramBot, message: TelegramBot.Message): Promise<boolean>;
}