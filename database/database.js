import { Sequelize } from 'sequelize'
import path from "path"

export class Database {

    /**
     * @type {Sequelize}
     * @private
     */
    _sequelize;

    constructor() {
        this._sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: path.join(process.cwd(), 'database.sqlite')
        });
    }

    /**
     * Получить экземпляр ОРМ
     *
     * @returns {Sequelize}
     */
    get sequelize() {
        return this._sequelize
    }

    /**
     * Подключиться к СУБД
     */
    async connect() {
        try {
            await this._sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error)
        }
    }

    /**
     * Синхронизировать таблицы
     *
     * @return {Database}
     */
    sync () {
        this._sequelize.sync()
            .then(() => {
                console.log('Таблица Chat была успешно синхронизирована!')
            })
            .catch((error) => {
                console.error('Ошибка при синхронизации модели Chat:', error)
            });
        return this;
    }
}

export const database = new Database()