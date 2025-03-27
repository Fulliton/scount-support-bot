import Action from "@actions/Action";
import "reflect-metadata";

export default function Voice() {
    return function (action: typeof Action) {
        // Добавляем команду в метаданные класса
        Reflect.defineMetadata("isVoice", true, action);
    };
}