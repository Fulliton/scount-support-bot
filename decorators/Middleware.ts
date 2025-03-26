import Action from "@actions/Action";
import "reflect-metadata";
import AbstractMiddleware from "@middlewares/AbstractMiddleware";

export function Middleware(middleware: typeof AbstractMiddleware) {
    return function (action: typeof Action) {
        // Добавляем команду в метаданные класса
        const existingMiddleware = Reflect.getMetadata("middlewares", action) || [];
        existingMiddleware.push(middleware);
        Reflect.defineMetadata("middlewares", existingMiddleware, action);
    };
}