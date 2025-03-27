import core from "@bootstrap/Core";
import {Chat} from "@app/models/Chat";
import {Repository} from "typeorm";

export default class ChatRepository{

    private _repository: Repository<Chat>;

    constructor() {
        this._repository = core.connection.getRepository(Chat)
    }

    /**
     * Получать или внести информацию о чате в таблицу
     * @param chat_id
     */
    async firstOrCreate(chat_id: number): Promise<Chat>
    {
        let chat = await core.connection.getRepository(Chat)
            .findOne({
                where: {
                    chat_id: chat_id
                }
            })

        if (chat === null) {
            chat = this._repository.create({
                chat_id: chat_id
            })

            await this._repository.save(chat);
        }

        return chat
    }

    async saveThreadId(chat: Chat, thread_id: string): Promise<Chat>
    {
        chat.thread_id = thread_id;
       return await this._repository.save(chat);
    }
}