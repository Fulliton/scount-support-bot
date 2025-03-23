const env = require('@helpers/env');

const config = {
    debug: env("APP_DEBUG", false),
}

module.exports = config