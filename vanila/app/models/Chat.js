import { DataTypes, Model  } from 'sequelize'
import { database } from '../../database/database.js'

export default class Chat extends Model {}

Chat.init(
    {
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
    },
    {
        // Other model options go here
        sequelize: database.sequelize, // We need to pass the connection instance
        modelName: 'Chat', // We need to choose the model name
    },
)