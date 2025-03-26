import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import TelegramBot from "node-telegram-bot-api"

import { database } from '../database/database.js';

dotenv.config();

export class Core {

    /**
     * Конфигурация проекта
     *
     * @type {[]}
     * @private
     */
    _config = [];
    /**
     * @private
     */
    _bot = null;

    /**
     * СУБД ОРМ
     *
     * @type {Database}
     * @private
     */
    _database = database;

    /**
     * Подключение конфигурации проекта
     *
     * @returns {Core}
     */
    async initConfig() {
        const configDir = path.join(process.cwd(), '/config')
        for (const file of fs.readdirSync(configDir)) {
            if (file.endsWith('.js')) {
                const name = path.basename(file, '.js');
                const modulePath = path.join(configDir, file);

                const importedModule = await import(modulePath);
                this._config[name] = importedModule.default || importedModule;
            }
        }

        return this
    }

    /**
     * Инициализация СУБД
     *
     * @returns {Core}
     */
    initDatabase() {
        this._database.connect()
            .then(() => console.debug('Core Connected to Database'))
            .catch(() => console.error('Core NOT Connected to Database'));

        return this;
    }

    /**
     * Создание бота
     *
     * @returns {Core}
     */
    initBot() {
        this._bot = new TelegramBot(
            this._config['telegram']['token'],
            { polling: true }
        )

        return this
    }

    /**
     * Получить копию бота для управления
     *
     * @returns {TelegramBot}
     */
    get bot() {
        return this._bot
    }

    /**
     * Получить конфигурация проекта
     *
     * @returns {[]}
     */
    get config() {
        return this._config;
    }

    /**
     * Регистрация всех сервисных провайдеров для работы ядра
     *
     * @returns {Core}
     */
    async registerProvider() {
        const providerDir = path.join(process.cwd(), '/bootstrap/providers')
        const files = fs.readdirSync(providerDir);
        for (const file of files) {
            if (file.endsWith('.js')) {
                const provider = new (await import(`./providers/${file}`)).default();
                await provider.boot(this)
            }
        }
        return this;
    }
}

export const core = new Core();