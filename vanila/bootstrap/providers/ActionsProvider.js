import path from "path";
import fs from "fs";

/**
 * Провайдер поднятия всех Экшенов
 */
export default class ActionsProvider {

    /**
     * Подключение провайдера
     *
     * @param {Core} core
     */
    async boot(core) {
        const routesDir = path.join(process.cwd(), '/app/actions')
        const files = fs.readdirSync(routesDir);
        for (const file of files) {
            if (file.endsWith('.js')) {
                const filePath = path.join(routesDir, file)
                await import(filePath);
            }
        }

        await this._registerActions(core)
        await this._registerVoiceAction(core)
        await this._registerMessageAction(core)
    }

    _checkMiddleware(core, msg, action) {
        const middleware = action.getMiddleware()
        // Если есть Middleware
        if (middleware) {
            (new middleware(msg)).handle()
                .then(result => result ? (new action(core.bot, msg)).handle() : null)
        } else {
            (new action(core.bot, msg)).handle();
        }
    }

    /**
     * Регистрация Команд
     * @param {Core} core
     * @private
     */
    async _registerActions(core) {
        const { commands } = await import('../../decorators/Command.js');

        commands.forEach(({ command, action }) => {
            core.bot.onText(command, (msg) => {
                this._checkMiddleware(core, msg, action);
            })
        });
    }

    /**
     * Регистрация на голосовые команды
     * @param {Core} core
     * @private
     */
    async _registerVoiceAction(core) {
        const { actions } = await import('../../decorators/Voice.js');
        actions.forEach((action) => {
            core.bot.on('voice', (msg) => (new action(core.bot, msg)).handle())
        });
    }

    async _registerMessageAction(core) {
        const { actions } = await import('../../decorators/Message.js');
        const { commands } = await import('../../decorators/Command.js');

        core.bot.on('message', (msg) => {

            // TODO: GlobalMiddleware
            // Chat.findOrCreate({where: {chat_id: msg.chat.id}})
            //     .then(([_, created]) => {
            //         if (created) {
            //             console.log('Чат был создан');
            //         } else {
            //             console.log('Чат уже существует');
            //         }
            //     })
            //     .catch((error) => {
            //         console.error('Произошла ошибка:', error);
            //     });
            if (commands.some(({command}) => command.test(msg.text))) {
                return false;  // Если найдено совпадение, возвращаем false
            }

            actions.forEach((action) => {
                this._checkMiddleware(core, msg, action);
            })
        });

        return this;
    }
}