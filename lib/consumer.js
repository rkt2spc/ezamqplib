var util = require('util');
var lodash = require('lodash');
var mq = require('./mq');
var Queue = require('./queue');
var EventEmmiter = require('events');

//========================================================================
// Consumer
//========================================================================
var Consumer = function (queue, params) {

    if (!(queue instanceof Queue))
        throw new TypeError('Consumer.consume expect Type Queue');

    this.queue = queue;
    this.opts = params.opts;

    this.privateChannel = null;
    this.consumerTag = null;
};

//------------------------------------------------------------------------
// Inherit EventEmmiter
util.inherits(Consumer, EventEmmiter);

//------------------------------------------------------------------------
// Start Consuming
Consumer.prototype.startConsume = function (channel, callback) {

    //------------------------------------------------------
    // Adjust arguments    
    if (arguments.length < 2) { 
        if (lodash.isFunction(arguments[arguments.length - 1])) {
            callback = arguments[arguments.length - 1];
            arguments[arguments.length - 1] = undefined;
        }
    }


    //------------------------------------------------------
    if (this.consumerTag) {
        // Already consuming, use listener to track messages
        return Promise.reject(new Error('Consumer.startConsume: Already consuming'))
            .catch((error) => {
                if (callback) callback(error);
                return error;
            });
    }

    if (channel) {

        return Promise.resolve(true)
            .then(() => this.queue.assert(channel))
            .then(() => channel.consume(this.queue.name, (msg) => { this.emit('message', msg.content.toString()); }, this.opts))
            .then((ok) => {
                this.consumerTag = ok.consumerTag;
                if (callback) callback(null, ok.consumerTag);
                return ok;
            })
            .catch((error) => {
                if (callback) callback(error);
                return error;
            });
    }
    else {

        return Promise.resolve(true)
            .then(() => mq.createChannel())
            .then((ch) => this.privateChannel = ch)
            .then(() => this.queue.assert(this.privateChannel))
            .then(() => this.privateChannel.consume(this.queue.name, (msg) => { this.emit('message', msg.content.toString()); }, this.opts))
            .then((ok) => {
                this.consumerTag = ok.consumerTag;
                if (callback) callback(null, ok.consumerTag);
                return ok;
            })
            .catch((error) => {
                if (callback) callback(error);
                return error;
            });
    }
};

//------------------------------------------------------------------------
// Stop Consuming
Consumer.prototype.stopConsume = function (channel, callback) {

    //------------------------------------------------------
    // Adjust arguments    
    if (arguments.length < 2) { 
        if (lodash.isFunction(arguments[arguments.length - 1])) {
            callback = arguments[arguments.length - 1];
            arguments[arguments.length - 1] = undefined;
        }
    }


    //------------------------------------------------------    
    if (!this.consumerTag && !this.privateChannel) {
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

    var privateChannelPromise = Promise.resolve(true);
    if (this.privateChannel) {
        privateChannelPromise = Promise.resolve(true)
            .then(() => this.privateChannel.close())
            .then(() => this.privateChannel = null);
    }


    return Promise.all([
        consumePromise,
        privateChannelPromise
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
// Exports
module.exports = Consumer;