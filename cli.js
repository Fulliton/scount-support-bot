#!/usr/bin/env node
/**
 * Загружаем ядро проекта
 */
require('module-alias/register');


const Core = require('@bootstrap/Core')
const Log = require("@bootstrap/Log")
Core.init()

const config = require('@bootstrap/config')

const args = process.argv.slice(2); // ['config']

const command = args[0];

if (command === 'config') {
    const tagArg = args.find(arg => arg.startsWith('--tag='));
    const tag = tagArg ? tagArg.split('=')[1] : null;
    if (tag) {
        Log.info('Config Project:', config(tag));
    } else {
        Log.info('Config Project:', core.config);
    }

    // тут можешь подключить и использовать свой config loader
} else if (command === 'start') {
    Log.debug('Init Core and create Polling Bot');
    Core.init()
        .initSaluteSpeech()
        .createBot()
        .registerRoute()
} else {
    Log.error(`Unknown command: ${command}`);
}