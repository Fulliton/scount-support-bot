import ServiceProvider from "@providers/ServiceProvider";
import * as Actions from "@actions/index"
import TelegramBot from 'node-telegram-bot-api'
import MiddlewareInterface from "@interfaces/MiddlewareInterface";
import ActionInterface from "@interfaces/ActionInterface";



export default class ActionProvider extends ServiceProvider{

    boot(): void {
        console.log('Actions', Actions);
        for (const ActionClass of Object.values(Actions)) {
            const registeredCommands: RegExp[] = Reflect.getMetadata("commands", ActionClass) || [];
            registeredCommands.forEach((command: RegExp) => {
                this._registerCommand(command, ActionClass);
            });
        }

        this._registerMessage()
        this._registerCallback()
    }

    private _registerMessage(): void {
        this.telegramBot.on('message', async (message: TelegramBot.Message) => {
            try {
                for (const ActionClass of Object.values(Actions)) {
                    const isMessage: boolean = Reflect.getMetadata("isMessage", ActionClass);

                    if (isMessage === true) {
                        const middlewares: Array<new () => MiddlewareInterface> = Reflect.getMetadata("middlewares", ActionClass) || [];
                        if (middlewares.length) {
                            const results = await Promise.all(
                                middlewares.map((middleware) => (new middleware()).handle(this.telegramBot, message))
                            );
                            if (results.every((result) => result === true)) {
                                console.debug('Received Message:', message.text);
                                (new ActionClass).handle(message)
                            }
                        } else {
                            console.debug('Received Message Not Middleware:', message.text);
                            (new ActionClass).handle(message)
                        }
                    }
                }
            } catch (err) {
                console.error('Error while handling handler');
            }
        })
    }

    private _registerCommand(command: RegExp, actionClass: new () => ActionInterface): void {
        // Регистрация команды для бота
        this.telegramBot.onText(command, (message: TelegramBot.Message) => {
            try {
                console.debug('Received Command:', message.text);
                (new actionClass).handle(message);
            } catch (err) {
                console.error('Error while handling handler');
            }

        });
    }

    private _registerCallback(): void {
        // Регистрация команды для бота
        this.telegramBot.on('callback_query', async (query: TelegramBot.CallbackQuery) => {
            try {
                for (const ActionClass of Object.values(Actions)) {
                    const callbacks: Array<string> = Reflect.getMetadata("callbacks", ActionClass) || [];

                    if (callbacks.length) {

                        if (callbacks.includes(query.data)) {

                            const middlewares: Array<new () => MiddlewareInterface> = Reflect.getMetadata("middlewares", ActionClass) || [];
                            if (middlewares.length) {
                                const results = await Promise.all(
                                    middlewares.map((middleware) => (new middleware()).handle(this.telegramBot, query.message))
                                );
                                if (results.every((result) => result === true)) {
                                    console.debug('Received Callback:', );
                                    (new ActionClass).handle(query.message)
                                }
                            } else {
                                console.debug('Received Callback Not Middleware:', query.data);
                                (new ActionClass).handle(query.message)
                            }

                        }
                    }
                }
            } catch (err) {
                console.error('Error while handling handler');
            }
        })
    }
}