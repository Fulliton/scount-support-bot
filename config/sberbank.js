const env = require('@helpers/env');

const config = {
    host: env("SB_HOST"),
    client_id: env("SB_CLIENT_ID"),
    client_secret: env("SB_CLIENT_SECRET"),
    scopes: env("SB_SCOPES"),
}

module.exports = config;