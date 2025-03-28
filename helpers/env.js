/**
 *
 * @param {string} name
 * @param {string|boolean|Number|null} defaultValue
 * @returns {string|boolean|Number|null}
 */
function env(name, defaultValue = null) {
    const value = process.env[name] ?? defaultValue

    if (value === 'true') {
        return true;
    } else if (value === 'false') {
        return false;
    }

    return value;
}

module.exports = env;