const Log = require('@helpers/Log');

const userStates = new Map();

const ADMIN_STATES = {
    SEND_ALL: 'SEND_ALL',
}
const COMMAND_STATES = {
    TOBACCO: 'TOBACCO',
    SPEAK: 'SPEAK',
}

function setState(userId, state) {

    userStates.set(userId, state);
    Log.debug('setState', userStates);
}

function getState(userId) {
    const answer = userStates.get(userId);
    Log.debug('getState', userStates);
    return answer;
}

function clearState(userId) {
    userStates.delete(userId);
    Log.debug('clearState', userStates);
}

module.exports = {
    setState,
    getState,
    clearState,
    COMMAND_STATES,
    ADMIN_STATES
};
