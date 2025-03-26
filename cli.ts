import * as dotenv from 'dotenv';
dotenv.config();

import core from '@bootstrap/Core'
import config from "@utils/config"

core.initTelegramBot()
    .initServiceProvider()

console.log(config('telegram.token'))