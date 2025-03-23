const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

class Core {

    config = [];
    _bot = null;

    constructor() {
        const configDir = path.join(__dirname, '/../config')
        fs.readdirSync(configDir).forEach((file) => {
            if (file.endsWith('.js')) {
                const name = path.basename(file, '.js'); // имя файла без .js
                const filePath = path.join(configDir, file);
                this.config[name] = require(filePath); // загружаем экспорт
            }
        });
        global.configData = this.config;
    }

    createBot() {
        const TelegramBot = require("node-telegram-bot-api");

        this._bot = new TelegramBot(
            this.config['telegram']['token'],
            { polling: true }
        );

        return this
    }

    getBot() {
        return this._bot
    }

    registerRoute() {
        const routesDir = path.join(__dirname, '/../app/routes')
        fs.readdirSync(routesDir).forEach((file) => {
            if (file.endsWith('.js')) {
                const filePath = path.join(routesDir, file);
                require(filePath); // загружаем экспорт
            }
        });
        return this;
    }
}

if (!(global.core instanceof Core)) {
    global.core = new Core;
}
/**
 *
 * @type {Core}
 */
module.exports = global.core;