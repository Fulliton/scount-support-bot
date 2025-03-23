const route = require('@bootstrap/route')
const StartAction = require('@actions/StartAction')

route(/\/start/, StartAction);