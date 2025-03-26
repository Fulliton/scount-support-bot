export const actions = [];

/**
 *
 * @returns {(function(*): void)|*}
 * @constructor
 */
export function Voice() {
    return function (action) {
        actions.push(action);
    };
}