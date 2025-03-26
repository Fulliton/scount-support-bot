export const commands = [];

/**
 *
 * @param {RegExp} command
 * @returns {(function(*): void)|*}
 * @constructor
 */
export function Command(command) {
    return function (action) {
        commands.push({ command, action });
    };
}