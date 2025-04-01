import {Message} from "node-telegram-bot-api";

export class GtpMessageState {
    private _state: Map<number, Message> = new Map()

    setState(chat_id: number, message: Message) {
        this._state.set(chat_id, message);
        console.debug('GptMessageState: setState', this._state);
    }

    /**
     * Получить состояние чата
     * @param chat_id
     */
    getState(chat_id: number): Message {
        const answer = this._state.get(chat_id);
        console.debug('GptMessageState: getState', this._state);
        return answer;
    }

    /**
     * Отчистить состояние чата
     * @param chat_id
     */
    clearState(chat_id: number) {
        this._state.delete(chat_id);
        console.debug('GptMessageState: clearState', this._state);
    }

    /**
     * Все стояния
     */
    get state() {
        console.debug('GptMessageState: get state', this._state);
        return this._state;
    }
}

const gtpMessageState = new GtpMessageState()
export default gtpMessageState