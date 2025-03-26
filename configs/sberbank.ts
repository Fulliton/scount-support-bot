"use strict"

const config: Object = {
    host: process.env.SB_HOST,
    client_id: process.env.B_CLIENT_ID,
    client_secret: process.env.SB_CLIENT_SECRET,
    scopes: process.env.SB_SCOPES,
    giga: process.env.SB_GIGA,
}

export default config