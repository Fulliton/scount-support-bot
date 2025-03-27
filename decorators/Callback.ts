import Action from "@actions/Action";
import "reflect-metadata";

export default function Callback(name: string) {
    return function (action: typeof Action) {
        // Добавляем команду в метаданные класса
        const existingCallback = Reflect.getMetadata("callbacks", action) || [];
        existingCallback.push(name);
        Reflect.defineMetadata("callbacks", existingCallback, action);
    };
}