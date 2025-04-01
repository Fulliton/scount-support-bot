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
        // const ids = ['599654992', '-1002057202339', '388536070', '72539448', '1004313700', '1250517869']
        //
        // ids.forEach((id: string) => {
        //     core.bot.sendMessage(id, '🤖 Бот стал умнее!\nТеперь я умею запоминать все твои покуры 😎\n'
        //         + "Просто вызови ассистента командой — /start_assistant\n"
        //         + "и попроси запомнить твой покур или табачок:\n"
        //         + "💬 Ассистент задаст пару уточняющих вопросов, и как только ты ответишь — покур сразу сохранится и будет использоваться для:\n"
        //         + "  * Подсказок по вкусу и миксам\n"
        //         + "  * Персональных подборок табака\n"
        //         + "  * Напоминаний о любимых покурах\n\n"
        //         + "📚 Вся история будет храниться за тобой. Хочешь — можно будет посмотреть, что курил, когда и с чем."
        //         + "Пробуй — /start_assistant\n"
        //         + "И твои покуры больше не забудутся 🙌\n"
        //     )
        // })

    })


// const gpt = new GptService();

// gpt.complete(1, 'Какой табак предложишь?')
//     .then(result => {
//         console.log(result)
//         gpt.complete(1, 'Что я тебя спрашивал только что, напомни?')
//             .then(result => console.log('Result 2', result))
//     })


console.log('Project Run')