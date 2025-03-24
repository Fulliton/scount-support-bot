class AbstractMiddleware {

    message = null;

    constructor(message) {
        this.message = message;
    }

    /**
     * Реализация методы проверка допуска к Action
     *
     * @return {boolean}
     */
    handle() {
        throw new Error('Not implemented');
    }
}

module.exports = AbstractMiddleware;