class AbstractMiddleware {

    message = null;

    constructor(message) {
        this.message = message;
    }

    /**
     * Реализация методы проверка допуска к Action
     * @return {Promise<boolean>}
     */
    async handle() {
        throw new Error('Not implemented');
    }
}

module.exports = AbstractMiddleware;