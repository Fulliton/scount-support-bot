import TelegramBot from "node-telegram-bot-api";

export default interface ActionInterface {
    handle(message: TelegramBot.Message): Promise<void>
}