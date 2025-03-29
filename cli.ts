import * as dotenv from 'dotenv';
dotenv.config();
global.__basedir = __dirname;
// import {GptService} from "@app/services/openai/GptService";

import core from '@bootstrap/Core'
import config from "@utils/config"
import {Chat} from "@app/models/Chat";


core.connectDatabase()
    .then(() => {
        core.initTelegramBot()
         .initServiceProvider()
    })


// const gpt = new GptService();

// gpt.complete(1, 'Какой табак предложишь?')
//     .then(result => {
//         console.log(result)
//         gpt.complete(1, 'Что я тебя спрашивал только что, напомни?')
//             .then(result => console.log('Result 2', result))
//     })


console.log('Project Run')