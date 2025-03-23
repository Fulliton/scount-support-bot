const route = require('@bootstrap/route')
const StartAction = require('@actions/StartAction')
const SpeakAction = require('@actions/SpeakAction')

route(/\/start/, StartAction);
route(/\/help/, StartAction);
route(/\/speak/, SpeakAction);