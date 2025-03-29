import core from "@bootstrap/Core";
import {Repository} from "typeorm";
import {Tobacco} from "@app/models/Tobacco";
import {Chat} from "@app/models";

export default class TobaccoRepository {

    private _repository: Repository<Tobacco>;

    constructor() {
        this._repository = core.connection.getRepository(Tobacco)
    }

    async save(tobacco: Tobacco): Promise<Tobacco>
    {
        return await this._repository.save(tobacco)
    }

    async getForChat(chat: number): Promise<Tobacco[]>
    {
        return await this._repository.findBy({
                chat_id: chat
            }
        )
    }
}