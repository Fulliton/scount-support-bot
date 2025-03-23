const Log = require("@bootstrap/Log")

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

    handle() {
        throw new Error('Not implemented');
    }

    /**
     * Отправить сообщение в ответ
     *
     * @param {string} text
     * @param {boolean} reply
     * @protected
     */
    _send(text, reply = false) {
        this.bot.sendMessage(
            this.message.chat.id,
            text,
            reply ? { reply_to_message_id: this.message.message_id} : {}
        )
            .catch(err => Log.error(err));
    }
}

module.exports = AbstractAction;