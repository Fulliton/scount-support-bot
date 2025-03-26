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
    }

    private _registerMessage(): void {
        this.telegramBot.on('message', async (message: TelegramBot.Message) => {
            for (const ActionClass of Object.values(Actions)) {
                const isMessage: boolean = Reflect.getMetadata("isMessage", ActionClass) || false;

                if (isMessage) {
                    const middlewares: Array<new () => MiddlewareInterface> = Reflect.getMetadata("middlewares", ActionClass) || [];
                    if (middlewares.length) {
                        const results = await Promise.all(
                            middlewares.map((middleware) => (new middleware()).handle(this.telegramBot, message))
                        );
                        if (results.every((result) => result === true)) {
                            (new ActionClass).handle(message)
                        }
                        break;
                    }

                    (new ActionClass).handle(message)
                    break;
                }
            }
        })
    }

    private _registerCommand(command: RegExp, actionClass: new () => ActionInterface): void {
        // Регистрация команды для бота
        this.telegramBot.onText(command, (message: TelegramBot.Message) => {
            console.debug('Received message:', message);
            (new actionClass).handle(message);
        });
    }
}