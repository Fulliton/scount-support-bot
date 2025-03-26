import env from '../helpers/env.js'

export default {
    debug: env("APP_DEBUG", false),
}