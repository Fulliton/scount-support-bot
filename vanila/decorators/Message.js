export const actions = [];

/**
 *
 * @returns {(function(*): void)|*}
 * @constructor
 */
export function Message() {
    return function (action) {
        actions.push(action);
    };
}