import TelegramBot from "node-telegram-bot-api";

export default interface MiddlewareInterface {
    handle(bot: TelegramBot, message: TelegramBot.Message): Promise<boolean>;
}