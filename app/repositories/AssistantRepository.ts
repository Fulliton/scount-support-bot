import core from "@bootstrap/Core";
import {Repository} from "typeorm";
import {Assistant} from "@app/models/Assistant";

export default class AssistantRepository {

    private _repository: Repository<Assistant>;

    constructor() {
        this._repository = core.connection.getRepository(Assistant)
    }

    /**
     * Получать или внести информацию о чате в таблицу
     */
    async first(): Promise<Assistant|null>
    {
        return await this._repository.findOne({
            where: {}, // обязательно!
            order: {
                id: 'ASC',
            },
        });
    }

    async create(assistant_id: string): Promise<Assistant>
    {
        const assistant = this._repository.create({
            assistant_id: assistant_id,
        });

        return await this._repository.save(assistant);
    }
}