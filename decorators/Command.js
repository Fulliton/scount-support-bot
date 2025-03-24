const commands = [];

/**
 *
 * @param {RegExp} command
 * @returns {(function(*): void)|*}
 * @constructor
 */
function Command(command) {
    return function (action) {
        commands.push({ command, action });
    };
}

module.exports = {
    Command,
    commands,
};