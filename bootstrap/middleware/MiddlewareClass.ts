import AbstractMiddleware from "@bootstrap/middleware/AbstractMiddleware";

export type MiddlewareClass<T extends AbstractMiddleware = any> = {
    new (...args: any[]): T;
};