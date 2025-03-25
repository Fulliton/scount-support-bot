const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
const SaluteSpeechService = require("@services/SaluteSpeechService");
const { sequelize, connect } = require('@bootstrap/database');
const Chat = require("@models/Chat");
import GigaChatService from '@services/GigaChatService';

dotenv.config();

class Core {

    config = [];
    /**
     *
     * @type {TelegramBot|null}
     * @private
     */
    _bot = null;

    /**
     *
     * @type {SaluteSpeechService|null}
     */
    saluteSpeech = null;

    /**
     *
     * @type {GigaChatService|null}
     */
    gigachatService = null;

    database = sequelize;

    constructor() {
        const configDir = path.join(__dirname, '/../config')
        fs.readdirSync(configDir).forEach((file) => {
            if (file.endsWith('.js')) {
                const name = path.basename(file, '.js'); // имя файла без .js
                this.config[name] = require(`@config/${file}`); // загружаем экспорт
            }
        });
        connect()
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

    initGigaChat() {
        this.gigachatService = new GigaChatService();
        global.gigachatService = this.gigachatService
        return this;
    }

    getBot() {
        return this._bot
    }

    registerActions() {
        const routesDir = path.join(__dirname, '/../app/actions')
        fs.readdirSync(routesDir).forEach((file) => {
            if (file.endsWith('.js')) {
                const filePath = path.join(routesDir, file);
                require(filePath); // загружаем экспорт
            }
        });

        return this;
    }

    registerCommand() {
        const { commands } = require('@decorators/Command');
        commands.forEach(({ command, action }) => {
            this._bot.onText(command, (msg) => {
                const middleware = action.getMiddleware()
                // Если есть Middleware
                if (middleware) {
                    (new middleware(msg)).handle()
                        .then(result => {
                            if (result) {
                                (new action(this._bot, msg)).handle();
                            }
                        })
                } else {
                    (new action(this._bot, msg)).handle();
                }
            })
        });

        return this;
    }

    registerVoiceAction() {
        const { actions } = require('@decorators/Voice');
        actions.forEach((action) => {
            this._bot.on('voice', (msg) => {
                // if (msg.audio || msg.voice) {
                    (new action(this._bot, msg)).handle();
                // }
            })
        });

        return this;
    }

    registerMessageAction() {
        const { actions } = require('@decorators/Message');
        const { commands } = require('@decorators/Command');

        this._bot.on('message', (msg) => {

            Chat.findOrCreate({where: {chat_id: msg.chat.id}})
                .then(([_, created]) => {
                    if (created) {
                        console.log('Чат был создан');
                    } else {
                        console.log('Чат уже существует');
                    }
                })
                .catch((error) => {
                    console.error('Произошла ошибка:', error);
                });

            const matchFound = commands.some(({command}) => command.test(msg.text));

            if (matchFound) {
                return false;  // Если найдено совпадение, возвращаем false
            }

            console.log('testetet')

            actions.forEach((action) => {
                const middleware = action.getMiddleware()
                // Если есть Middleware
                if (middleware) {
                    // Если Middleware дал положительный результат
                    (new middleware(msg)).handle()
                        .then(result => {
                            if (result) {
                                (new action(this._bot, msg)).handle();
                            }
                        })
                } else {
                    // Если нет Middleware
                    (new action(this._bot, msg)).handle();
                }
            })
        });

        return this;
    }
}

module.exports = Core