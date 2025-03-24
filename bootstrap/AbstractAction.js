const Log = require("../helpers/Log")

class AbstractAction {

    bot;
    message;

    /**
     * @param {TelegramBot} bot
     * @param {Object} message
     */
    constructor(bot, message) {
        this.bot = bot;
        this.message = message;

        Log.debug('Receive new message', message);
    }

    /**
     *
     * @returns {typeof AbstractMiddleware|null}
     */
    static getMiddleware() {
        return null
    }

    handle() {
        throw new Error('Not implemented');
    }

    /**
     * Отправить сообщение в ответ
     *
     * @param {string} text
     * @param {boolean} reply
     * @param {Number|null} chat_id
     * @protected
     */
    async _send(text, reply = false, chat_id = null) {
        return await this.bot.sendMessage(
            chat_id ?? this.message.chat.id,
            text,
            reply ? { reply_to_message_id: this.message.message_id} : {}
        )
    }

    async _delete(message) {
        if (message) {
            await this.bot.deleteMessage(this.message.chat.id, message.message_id);
        }
    }
}

module.exports = AbstractAction;