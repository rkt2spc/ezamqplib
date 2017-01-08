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
module.exports = Object.create(mq);
module.exports.Provider = Provider;
module.exports.Consumer = Consumer;
module.exports.Queue = Queue;
module.exports.Exchange = Exchange;