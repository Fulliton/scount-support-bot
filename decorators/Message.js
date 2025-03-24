const actions = [];

/**
 *
 * @returns {(function(*): void)|*}
 * @constructor
 */
function Message() {
    return function (action) {
        actions.push(action);
    };
}

module.exports = {
    Message,
    actions,
};