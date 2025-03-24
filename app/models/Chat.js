const { DataTypes } = require('sequelize');
const {sequelize} = require('@bootstrap/database');

const Chat = sequelize.define('Chat', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    chat_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        default: false,
    },
    connect_date: {
        type:DataTypes.DATE,
        allowNull: false,
        defaultValue: Date.now(),
    },
})

sequelize.sync()
    .then(() => {
        console.log('Таблица Chat была успешно синхронизирована!');
    })
    .catch((error) => {
        console.error('Ошибка при синхронизации модели Chat:', error);
    });

module.exports = Chat;