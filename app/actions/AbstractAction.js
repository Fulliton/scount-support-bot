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
    }

    handle() {
        throw new Error('Not implemented');
    }

    _send(text) {
        this.bot.sendMessage(
            this.message.chat.id,
            text
        )
    }
}

module.exports = AbstractAction;