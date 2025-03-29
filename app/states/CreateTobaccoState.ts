import {Tobacco} from "@app/models";

export class CreateTobaccoState {
    private _state: Map<number, Tobacco> = new Map()

    setState(chat_id: number, tobacco: Tobacco) {
        this._state.set(chat_id, tobacco);
        console.debug('CreateTobaccoState: setState', this._state);
    }

    /**
     * Получить состояние чата
     * @param chat_id
     */
    getState(chat_id: number): Tobacco {
        const answer = this._state.get(chat_id);
        console.debug('CreateTobaccoState: getState', this._state);
        return answer;
    }

    /**
     * Отчистить состояние чата
     * @param chat_id
     */
    clearState(chat_id: number) {
        this._state.delete(chat_id);
        console.debug('CreateTobaccoState: clearState', this._state);
    }

    /**
     * Все стояния
     */
    get state() {
        console.debug('CreateTobaccoState: get state', this._state);
        return this._state;
    }
}

const createTobaccoState = new CreateTobaccoState()
export default createTobaccoState