import "reflect-metadata";
import Action from "@bootstrap/actions/Action";
import {MiddlewareClass} from "@bootstrap/middleware/MiddlewareClass";

export default function Middleware(middleware: MiddlewareClass, args: any[] = []) {
    return function (action: typeof Action) {
        // Добавляем команду в метаданные класса
        const existingMiddleware = Reflect.getMetadata("middlewares", action) || [];
        existingMiddleware.push(Reflect.construct(middleware, args));
        Reflect.defineMetadata("middlewares", existingMiddleware, action);
    };
}