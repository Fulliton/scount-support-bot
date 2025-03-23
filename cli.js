#!/usr/bin/env node
/**
 * Загружаем ядро проекта
 */

const core = require('./bootstrap/Core');
const Log = require('./bootstrap/Log');

const args = process.argv.slice(2); // ['config']
const command = args[0];

if (command === 'config') {
    const tagArg = args.find(arg => arg.startsWith('--tag='));
    const tag = tagArg ? tagArg.split('=')[1] : null;
    if (tag) {
        Log.info('Config Project:', require('./bootstrap/config.js')(tag));
    } else {
        Log.info('Config Project:', core.config);
    }

    // тут можешь подключить и использовать свой config loader
} else if (command === 'start') {
    require('./start')
} else {
    Log.error(`Unknown command: ${command}`);
}