const route = require('../../bootstrap/route');

const TestAction = require('../actions/TestAction');

route(/\/photo/, TestAction);