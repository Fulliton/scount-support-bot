const core = require('./Core')

/**
 *
 * @param {RegExp} path
 * @param action
 */
module.exports = function route(path, action) {
    core.getBot().onText(path, (msg) => (new action).handle(core.getBot(), msg))
}