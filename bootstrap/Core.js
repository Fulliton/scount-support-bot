const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
const SaluteSpeechService = require("../services/SaluteSpeechService");

dotenv.config();

class Core {

    config = [];
    _bot = null;
    saluteSpeech = null;

    constructor() {
        const configDir = path.join(__dirname, '/../config')
        fs.readdirSync(configDir).forEach((file) => {
            if (file.endsWith('.js')) {
                const name = path.basename(file, '.js'); // имя файла без .js
                this.config[name] = require(`@config/${file}`); // загружаем экспорт
            }
        });
        global.configData = this.config;
        global.core = this;
    }

    static init() {
        return new Core();
    }

    createBot() {
        const TelegramBot = require("node-telegram-bot-api");

        this._bot = new TelegramBot(
            this.config['telegram']['token'],
            { polling: true }
        );

        return this
    }

    initSaluteSpeech() {
        this.saluteSpeech = new SaluteSpeechService;
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

module.exports = Core