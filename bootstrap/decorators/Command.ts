import Action from "@bootstrap/actions/Action";
import "reflect-metadata";

export default function Command(command: RegExp) {
    return function (action: typeof Action) {
        // Добавляем команду в метаданные класса
        const existingCommands = Reflect.getMetadata("commands", action) || [];
        existingCommands.push(command);
        Reflect.defineMetadata("commands", existingCommands, action);
    };
}