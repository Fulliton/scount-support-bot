#!/usr/bin/env node
/**
 * Загружаем ядро проекта
 */
// ✅ Включаем поддержку Babel-декораторов
require('@babel/register')({
    extensions: ['.js'],
    ignore: [/node_modules/]
});

require('module-alias/register');



const Core = require('@bootstrap/Core')
const Log = require("./helpers/Log")
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
        .registerActions()
        .registerCommand()
        .registerVoiceAction()
        .registerMessageAction()
} else {
    Log.error(`Unknown command: ${command}`);
}