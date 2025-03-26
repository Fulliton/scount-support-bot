import { core } from '../bootstrap/Core.js'

/**
 * Получить данные с конфиг по ключу
 *
 * @param {String} key
 * @example "telegram.token"
 */
export default function config(key) {
    function get(keys, config) {
        const key = keys.shift();

        if (keys.length >= 1) {
            return get(keys, config[key]);
        }

        return config[key];
    }

    return get(key.split('.'), core.config);
}