const config = require('@bootstrap/config')

class Log {
    static info(log, data = null) {
        data ? console.info(`[INFO] ${log}`, data) : console.info(`[INFO] ${log}`);
    }

    static debug(log, data = null) {
        if (config('app.debug')) {
            data ? console.debug(`[DEBUG] ${log}`, data) : console.debug(`[DEBUG] ${log}`);
        }

    }

    static error(log, data = null) {
        data ? console.error(`[ERROR] ${log}`, data) : console.error(`[ERROR] ${log}`);
    }
}

module.exports = Log;