import env from '../helpers/env.js'

export default {
    host: env("SB_HOST"),
    client_id: env("SB_CLIENT_ID"),
    client_secret: env("SB_CLIENT_SECRET"),
    scopes: env("SB_SCOPES"),
    giga: env("SB_GIGA"),
}