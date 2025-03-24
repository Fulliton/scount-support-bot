const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
const SaluteSpeechService = require("@services/SaluteSpeechService");

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
                (new action(this._bot, msg)).handle();
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
        console.log(actions)
        this._bot.on('message', (msg) => {
            const matchFound = commands.some(({command}) => command.test(msg.text));

            if (matchFound) {
                return false;  // Если найдено совпадение, возвращаем false
            }

            actions.forEach((action) => {
                const middleware = action.getMiddleware()
                // Если есть Middleware
                if (middleware) {
                    // Если Middleware дал положительный результат
                    if((new middleware(msg)).handle()) {
                        // Передать в работу Action
                        (new action(this._bot, msg)).handle();
                        return false;
                    }
                } else {
                    // Если нет Middleware
                    (new action(this._bot, msg)).handle();
                    return false;
                }
            })
        });

        return this;
    }
}

module.exports = Core