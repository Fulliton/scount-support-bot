import Command from "@decorators/Command";
import Action from "@actions/Action";
import TelegramBot from "node-telegram-bot-api";
import chatState from "@app/states/ChatState";
import createTobaccoState from "@app/states/CreateTobaccoState";
import StateEnum from "@app/enums/StateEnum";
import TobaccoRepository from "@app/repositories/TobaccoRepository";
import {Tobacco} from "@app/models";
import Message from "@decorators/Message";
import {sleep} from "openai/core";
import * as fs from "node:fs";
import * as path from "node:path";
import gptService from "@app/services/openai/GptService";
import ChatRepository from "@app/repositories/ChatRepository";

@Command(/^\/create_tobacco$/)
export class StartCreateTobacco extends Action{
    async handle(message: TelegramBot.Message): Promise<void> {
        createTobaccoState.clearState(message.chat.id)

        await this._send(
            "Я запомню что ты курил. И задам несколько вопросов.\n" +
            "1) Название табака:",
            message.chat.id,
        )
        await sleep(500)
        chatState.setState(message.chat.id, StateEnum.TOBACCO_STAGE_1)
    }
}

@Message()
export class SetNameTobacco extends Action{
    async handle(message: TelegramBot.Message): Promise<void> {
        if (chatState.getState(message.chat.id) === StateEnum.TOBACCO_STAGE_1) {

            const tobacco = new Tobacco()
            tobacco.name = message.text
            tobacco.chat_id = message.chat.id
            createTobaccoState.setState(message.chat.id, tobacco)

            await this._send(
                "2) Оцени крепость от 0 до 10: ",
                message.chat.id,
            )
            await sleep(500)
            chatState.setState(message.chat.id, StateEnum.TOBACCO_STAGE_2)
        }

    }
}

@Message()
export class SetTasteTobacco extends Action{
    async handle(message: TelegramBot.Message): Promise<void> {
        if (chatState.getState(message.chat.id) === StateEnum.TOBACCO_STAGE_2) {

            const tobacco = createTobaccoState.getState(message.chat.id)
            tobacco.taste = Number(message.text)
            createTobaccoState.setState(message.chat.id, tobacco)

            await this._send(
                "3) Время курения: ",
                message.chat.id,
            )
            await sleep(500)
            chatState.setState(message.chat.id, StateEnum.TOBACCO_STAGE_3)
        }
    }
}

@Message()
export class SetSmokingTimeTobacco extends Action{
    async handle(message: TelegramBot.Message): Promise<void> {
        if (chatState.getState(message.chat.id) === StateEnum.TOBACCO_STAGE_3) {

            const tobacco = createTobaccoState.getState(message.chat.id)
            tobacco.smoking_time = message.text
            createTobaccoState.setState(message.chat.id, tobacco)

            await this._send(
                "4) Оцени жаростойкость: ",
                message.chat.id,
            )
            await sleep(500)
            chatState.setState(message.chat.id, StateEnum.TOBACCO_STAGE_4)
        }
    }
}

@Message()
export class SetHeatResistanceTobacco extends Action{
    async handle(message: TelegramBot.Message): Promise<void> {
        if (chatState.getState(message.chat.id) === StateEnum.TOBACCO_STAGE_4) {

            const tobacco = createTobaccoState.getState(message.chat.id)
            tobacco.heat_resistance = message.text
            createTobaccoState.setState(message.chat.id, tobacco)

            await this._send(
                "5) На сколько тяжелый он был: ",
                message.chat.id,
            )
            await sleep(500)
            chatState.setState(message.chat.id, StateEnum.TOBACCO_STAGE_5)
        }
    }
}

@Message()
export class SetHeavinessTobacco extends Action{
    async handle(message: TelegramBot.Message): Promise<void> {
        if (chatState.getState(message.chat.id) === StateEnum.TOBACCO_STAGE_5) {

            const tobacco = createTobaccoState.getState(message.chat.id)
            tobacco.heaviness = message.text
            createTobaccoState.setState(message.chat.id, tobacco)

            await this._send(
                "6) Ожидаю вывод: ",
                message.chat.id,
            )
            await sleep(500)
            chatState.setState(message.chat.id, StateEnum.TOBACCO_STAGE_6)
        }
    }
}

@Message()
export class SetConclusionTobacco extends Action{
    async handle(message: TelegramBot.Message): Promise<void> {

        if (chatState.getState(message.chat.id) === StateEnum.TOBACCO_STAGE_6) {
            const tobaccoRepository = new TobaccoRepository()
            const tobacco = createTobaccoState.getState(message.chat.id)
            tobacco.conclusion = message.text
            await tobaccoRepository.save(tobacco)
            chatState.clearState(message.chat.id)
            createTobaccoState.clearState(message.chat.id)



            await this._send(
                "Спасибо. Я запомнил и переобучился",
                message.chat.id,
            )

            const tobaccos = await tobaccoRepository.getForChat(message.chat.id)
            const content = tobaccos.map((tobacco) => {
                return "Название табака: " + tobacco.name +
                    "\nВкус: " + tobacco.taste + " по 10 бальной шкале" +
                    "\nСреднее продолжительность время курения: " + tobacco.smoking_time +
                    "\nЖаростойкость: " + tobacco.heat_resistance +
                    "\nТяжесть: " + tobacco.heaviness +
                    "\nМой вывод: " + tobacco.conclusion

            }).join("\n\n--------\n\n")

            const pathFile = path.resolve("tobaccos/"+ message.chat.id + ".txt")
            fs.writeFileSync(pathFile, content)

            const chatRepository = new ChatRepository()
            let chat = await chatRepository.firstOrCreate(message.chat.id)

            if (chat.assistant_id === null || chat.assistant_id === undefined) {
                const assistant = await gptService.createAssistant(chat.chat_id.toString())
                chat = await chatRepository.saveAssistant(chat, assistant.id)
            }

            if (chat.thread_id === null || chat.thread_id === undefined) {
                const thread = await gptService.createThread()
                chat =await chatRepository.saveThreadId(chat, thread.id)
            }

            if (chat.vector_store_id === null || chat.vector_store_id === undefined) {
                const store = await gptService.createVectorStore(chat.chat_id.toString())
                chat = await chatRepository.saveVectorStore(chat, store.id)
                await gptService.setVectorStoreInAssistant(chat.assistant_id, chat.vector_store_id)
            }

            await gptService.deleteAllVectorFiles(chat.vector_store_id)
            await gptService.setFileInVectorStore(pathFile, chat.vector_store_id)

            fs.unlinkSync(pathFile)
        }
    }
}