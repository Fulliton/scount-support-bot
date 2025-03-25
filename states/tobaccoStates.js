const Log = require('@helpers/Log');

const tobaccoStates = [];

function addState(state) {
    tobaccoStates.push(state);
    Log.debug('- TOBACCO - addState', tobaccoStates);
}

function getState() {
    return tobaccoStates;
}

module.exports = {
    getState,
    addState,
    tobaccoStates,
};
