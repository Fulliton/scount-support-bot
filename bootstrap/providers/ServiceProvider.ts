import * as TelegramBot from "node-telegram-bot-api";
import { Core } from "@bootstrap/Core";

export default class ServiceProvider {
    telegramBot: TelegramBot;
    core: Core;

    constructor(telegramBot: TelegramBot, core: Core) {
        this.telegramBot = telegramBot;
        this.core = core;
    }

    boot(): void {
        throw new Error('Instantiated ServiceProvider');
    }
}