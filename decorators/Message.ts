import Action from "@actions/Action";
import "reflect-metadata";

export default function Message() {
    return function (action: typeof Action) {
        // Добавляем команду в метаданные класса
        Reflect.defineMetadata("isMessage", true, action);
    };
}