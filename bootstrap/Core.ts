"use strict"

import "reflect-metadata";
import TelegramBot from "node-telegram-bot-api"
import * as configs from '../configs'
import * as providers from "@providers/index"
import ServiceProvider from "@providers/ServiceProvider"
import { DataSource } from "typeorm";
import * as Models from "@app/models";

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

    _connection: DataSource|null = null;

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

    async connectDatabase() {
        console.debug('Initializing database');
        try {
            this._connection = new DataSource({
                type: "sqlite",
                database: 'database.sqlite',
                entities: Models,
                synchronize: true,
            }); // Establish connection using ormconfig.json
            await this._connection.initialize()
            await this._connection.synchronize()
            console.log("Database connected successfully!");
        } catch (error) {
            console.error("Error connecting to the database:", error);
        }
    }

    get config(): Object
    {
        return this._config
    }

    get bot(): TelegramBot
    {
        return this._bot
    }

    get connection(): DataSource
    {
        return this._connection
    }
}

const core = (new Core).initConfig();

export default core;
