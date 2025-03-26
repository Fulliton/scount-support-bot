#!/usr/bin/env node
/**
 * Загружаем ядро проекта
 */

import { core } from "./bootstrap/Core.js";
import config from "./helpers/config.js";

const args = process.argv.slice(2); // ['config']
const command = args[0];

await core.initConfig()

if (command === 'config') {

    const tagArg = args.find(arg => arg.startsWith('--tag='));
    const tag = tagArg ? tagArg.split('=')[1] : null;
    if (tag) {
        console.info('Config Project in tags:', config(tag));
    } else {
        console.info('Config Project:', core.config);
    }

} else if (command === 'start') {

    console.debug('Init Core and create Polling Bot');
    core.initDatabase()
        .initBot()
    await core.registerProvider()

} else {
    console.error(`Unknown command: ${command}`);
}