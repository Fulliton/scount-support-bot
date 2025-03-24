const actions = [];

/**
 *
 * @returns {(function(*): void)|*}
 * @constructor
 */
function Voice() {
    return function (action) {
        actions.push(action);
    };
}

module.exports = {
    Voice,
    actions,
};