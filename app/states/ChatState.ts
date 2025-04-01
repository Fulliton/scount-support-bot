import StateEnum from "@app/enums/StateEnum";

export class ChatState {
    private _state: Map<string|number, StateEnum> = new Map()

    /**
     * Внести состояние для чата
     * @param chat_id
     * @param state
     */
    setState(chat_id: string|number, state: StateEnum) {
        this._state.set(chat_id, state);
        console.debug('UserState: setState', this._state);
    }

    /**
     * Получить состояние чата
     * @param chat_id
     */
    getState(chat_id: string|number) {
        const answer = this._state.get(chat_id);
        console.debug('UserState: getState', this._state);
        return answer;
    }

    /**
     * Отчистить состояние чата
     * @param chat_id
     */
    clearState(chat_id: string|number) {
        this._state.delete(chat_id);
        console.debug('UserState: clearState', this._state);
    }

    /**
     * Все стояния
     */
    get state() {
        console.debug('UserState: get state', this._state);
        return this._state;
    }
}

const chatState = new ChatState()
export default chatState