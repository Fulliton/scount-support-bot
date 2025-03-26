class UserState {
    _state = new Map()

    setState(chatId, state) {
        this._state.set(chatId, state);
        console.debug('UserState: setState', this._state);
    }

    getState(chatId) {
        const answer = this._state.get(chatId);
        console.debug('UserState: getState', this._state);
        return answer;
    }

    clearState(chatId) {
        this._state.delete(chatId);
        console.debug('UserState: clearState', this._state);
    }

    get state() {
        console.debug('UserState: get state', this._state);
        return this._state;
    }
}

const userState = new UserState()
export default userState