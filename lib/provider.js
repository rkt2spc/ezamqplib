var mq = require('./mq');
var Exchange = require('./exchange');
var Queue = require('./queue');

//========================================================================
// Provider 
//========================================================================
var Provider = function () { };

//------------------------------------------------------------------------
// Provider Publish
Provider.prototype.publishTo = function (exchange, params, channel, done) {
    
    var routingKey = params.routingKey;
    var publishOpts = params.opts;
    var message = params.message;

    if (!(exchange instanceof Exchange))
        return done(new TypeError('Provider publish expect Type Exchange'));
    
    return Promise.resolve(true)
        .then(() => channel.publish(exchange.name, routingKey, Buffer.from(message), publishOpts))
        .then(() => done())
        .catch((e) => done(e));
};

//------------------------------------------------------------------------
// Provider Send to Queue
Provider.prototype.sendTo = function (queue, params, channel, done) {

    var sendOpts = params.opts;
    var message = params.message;

    if (!(queue instanceof Queue))
        return done(new TypeError('Provider publish expect Type Exchange'));
    
    return Promise.resolve(true)
        .then(() => channel.sendToQueue(queue.name, Buffer.from(message), sendOpts))
        .then(() => done())
        .catch((e) => done(e));
};

//------------------------------------------------------------------------
// Exports
module.exports = Provider;