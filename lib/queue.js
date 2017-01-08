var lodash = require('lodash');
var Promise = require('bluebird');
//------------------------------------------------------------------------
var mq = require('./mq');
var utilities = require('./utilities');
var Exchange = require('./exchange');
//------------------------------------------------------------------------


var Queue = function (params) {
    this.name = params.name;
    this.assertOpts = params.assertOpts;
    this.deleteOpts = params.deleteOpts;

    var sample_assert_opts = {
        exclusive: false,
        durable: true,
        autoDelete: false,
        arguments: {} // { flag: value, }
    };

    var sample_delete_opts = {
        ifUnused: false,
        ifEmpty: false
    };
};

//------------------------------------------------------------------------
// Assert Queue
Queue.prototype.assert = function (channel, callback) {

    //------------------------------------------------------
    // Adjust arguments    
    callback = utilities.mapCallback(arguments, 2);

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
        .then(() => channel.assertQueue(this.name, this.assertOpts))

        // Post-Ops
        .then(() => {
            if (createdChannel) return channel.close();
            return true;
        })
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
// Check Queue
Queue.prototype.check = function (channel, callback) {
    //------------------------------------------------------
    // Adjust arguments    
    callback = utilities.mapCallback(arguments, 2);

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
        .then(() => channel.checkQueue(this.name))

        // Post-Ops
        .then(() => {
            if (createdChannel) return channel.close();
            return true;
        })
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
// Delete Queue
Queue.prototype.delete = function (channel, callback) {
    //------------------------------------------------------
    // Adjust arguments    
    callback = utilities.mapCallback(arguments, 2);

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
        .then(() => channel.deleteQueue(this.name, this.deleteOpts))

        // Post-Ops
        .then(() => {
            if (createdChannel) return channel.close();
            return true;
        })
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
// Purge Queue
Queue.prototype.purge = function (channel, callback) {
    //------------------------------------------------------
    // Adjust arguments    
    callback = utilities.mapCallback(arguments, 2);

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
        .then(() => channel.purgeQueue(this.name))

        // Post-Ops
        .then(() => {
            if (createdChannel) return channel.close();
            return true;
        })
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
// Bind to Exchange
Queue.prototype.bind = function (exchange, pattern, channel, callback) {

    //------------------------------------------------------
    // Adjust arguments    
    callback = utilities.mapCallback(arguments, 4);


    //------------------------------------------------------
    if (!(exchange instanceof Exchange))
        throw new TypeError('Queue binding expect Type Exchange');


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
        .then(() => this.assert(channel))
        .then(() => exchange.assert(channel))
        .then(() => channel.bindQueue(this.name, exchange.name, pattern))

        // Post-Ops
        .then(() => {
            if (createdChannel) return channel.close();
            return true;
        })
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
// Unbind from Exchange
/**
 * Returns a promise piping through all neccessary operations
 * @param {Exchange} exchange - The exchange to unbind to
 * @param {String} pattern - The bind patttern
 * @param {Object} [args] - Arguments to server JSON style object
 * @param {Channel} [channel] - TCP channel to work on, dynamicly create one if ommited
 * @param {Callback} [callback] - Called when all operations are done
 */
Queue.prototype.unbind = function (exchange, pattern, args, channel, callback) {

    //------------------------------------------------------
    // Adjust arguments    
    callback = utilities.mapCallback(arguments, 4);


    //------------------------------------------------------    
    if (!(exchange instanceof Exchange))
        throw new TypeError('Queue unbinding expect Type Exchange');


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
        .then(() => this.check(channel))
        .then(() => exchange.check(channel))
        .then(() => channel.unbindQueue(this.name, exchange.name, pattern))

        // Post-Ops
        .then(() => {
            if (createdChannel) return channel.close();
            return true;
        })
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
module.exports = Queue;