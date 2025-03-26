"use strict"

import TelegramBot from "node-telegram-bot-api"
import * as configs from '../configs'
import * as providers from "@providers/index"
import ServiceProvider from "@providers/ServiceProvider";

export class Core {
    /**
     * Конфигурация проекта
     * @private
     */
    _config: Object = {};

    /**
     * @private
     */
    _bot: TelegramBot = null;

    constructor() {
        console.debug('Core: Initializing');
    }

    /**
     * Подключение конфигурации проекта
     */
    initConfig(): Core {
        console.debug('Core: Initializing config');
        this._config = configs
        return this
    }

    initTelegramBot(): Core {
        console.debug('Core: Initializing telegram bot');
        this._bot = new TelegramBot(this._config['telegram'].token, {polling: true});
        return this
    }

    initServiceProvider(): void {
        console.debug('Core: Initializing service provider');
        Object.keys(providers).forEach((className) => {
            const p: ServiceProvider = new providers[className](this.bot, this)
            p.boot()
        })
    }

    get config(): Object
    {
        return this._config
    }

    get bot(): TelegramBot
    {
        return this._bot
    }
}

const core = (new Core).initConfig();

export default core;
