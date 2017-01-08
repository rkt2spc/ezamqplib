var util = require('util');
var lodash = require('lodash');
var EventEmmiter = require('events');

//------------------------------------------------------------------------
var mq = require('./mq');
var Queue = require('./queue');
var utilities = require('./utilities');
//------------------------------------------------------------------------
var defaultConsumeOpts = {
    consumerTag: undefined, // Distiguish consumerTag
    noAck: false,
    exclusive: false, // Stop all other from consuming this queue
    priority: undefined, // Higher more message receives in round-robin routing
    arguments: {}
};

//========================================================================
// Consumer
//========================================================================
var Consumer = function (queue, params) {

    if (!(queue instanceof Queue))
        throw new TypeError('Consumer.constructor expect Type Queue');

    this.queue = queue;
    this.opts = params.opts;

    this.privateChannel = false;
    this.channel = null;
    this.consumerTag = null;
};

//------------------------------------------------------------------------
// Inherit EventEmmiter
util.inherits(Consumer, EventEmmiter);

//------------------------------------------------------------------------
// Start Consuming
Consumer.prototype.consume = function (channel, callback) {

    //------------------------------------------------------
    // Adjust arguments    
    callback = utilities.mapCallback(arguments, 2);


    //------------------------------------------------------
    if (this.consumerTag || this.channel) {
        // Already consuming, use listener to track messages instead
        return Promise.reject(new Error('Consumer.startConsume: Already consuming'))
            .catch((error) => {
                if (callback) callback(error);
                return error;
            });
    }

    //------------------------------------------------------
    var createdChannel = false;
    return Promise.resolve(true)
        // Pre-Ops
        .then(() => {
            if (channel) return channel;
            createdChannel = true;
            return mq.createChannel();
        })
        .then((ch) => channel = ch)

        // Ops
        .then(() => this.queue.assert(channel))
        .then(() => channel.consume(this.queue.name, this.processMessage, this.opts))
        .then((ok) => {
            this.consumerTag = ok.consumerTag;
            this.channel = channel;
            this.privateChannel = createdChannel;
        })

        // Post-Ops
        .then((ok) => {
            if (callback) callback(null, ok);
            return ok;
        })
        .catch((error) => {
            if (callback) callback(error);
            return error;
        });
};

//------------------------------------------------------------------------
// Stop Consuming
Consumer.prototype.cancel = function (channel, callback) {

    //------------------------------------------------------
    // Adjust arguments    
    callback = utilities.mapCallback(arguments, 2);


    //------------------------------------------------------    
    if (!this.consumerTag && !this.channel) {
        // Not consumning, begin consume to stop
        return Promise.reject(new Error('Consumer.stopConsume: Not consuming'))
            .catch((error) => {
                if (callback) callback(error);
                return error;
            });
    }

    var consumePromise = Promise.resolve(true);
    if (this.consumerTag) {
        if (channel)
            consumePromise = Promise.resolve(true)
                .then(() => channel.cancel(this.consumerTag))
                .then(() => this.consumerTag = null);
        else
            consumePromise = Promise.resolve(true)
                .then(() => mq.createChannel())
                .then((ch) => channel = ch)
                .then(() => channel.cancel(this.consumerTag))
                .then(() => this.consumerTag = null)
                .then(() => channel.close());
    }

    var channelPromise = Promise.resolve(true);
    if (this.channel) {
        if (!this.privateChannel)
            channelPromise = Promise.resolve(true)
                .then(() => this.channel = null);
        else
            channelPromise = Promise.resolve(true)
                .then(() => this.channel.close())
                .then(() => {
                    this.channel = null; 
                    this.privateChannel = false;
                });
    }


    return Promise.all([
        consumePromise,
        channelPromise
    ])
        .then((ok) => {
            if (callback) callback(null, ok);
            return ok;
        })
        .catch((error) => {
            if (callback) callback(error);
            return error;
        });
};

//------------------------------------------------------------------------
// Process message
Consumer.prototype.processMessage = function (msg) {
    //------------------------------------------------------
    // Default Example. Meant to be overrided
    var ch = this.channel;
    this.emit('message', msg.content.toString());
    ch.ack(msg);
};


//------------------------------------------------------------------------
// Exports
module.exports = Consumer;