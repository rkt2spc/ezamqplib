//------------------------------------------------------------------------

var mq = require('./lib/mq');
var Provider = require('./lib/provider');
var Consumer = require('./lib/consumer');
var Queue = require('./lib/queue');
var Exchange = require('./lib/exchange');

//------------------------------------------------------------------------
var uri = 'amqp://krcihysa:j-_iaJkdSKNHOK7SjsVXLAZG6hzHG5kL@hyena.rmq.cloudamqp.com/krcihysa';

//------------------------------------------------------------------------
// Exports
module.exports = {
    Provider    : Provider,
    Consumer    : Consumer,
    Queue       : Queue,
    Exchange    : Exchange
};
Object.assign(module.exports, mq);
