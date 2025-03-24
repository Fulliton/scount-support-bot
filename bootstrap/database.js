import { Sequelize } from 'sequelize';
import path from "path";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '/../database.sqlite')
});

async function connect() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = {
    sequelize,
    connect
};