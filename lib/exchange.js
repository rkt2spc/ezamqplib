//------------------------------------------------------------------------
var mq = require('./mq');
var utilities = require('./utilities');

//------------------------------------------------------------------------
var defaultAssertOpts = {};
var defaultDeleteOpts = {};

//========================================================================
// Exchange
//========================================================================
var Exchange = function (params) {
    this.name = params.name;
    this.type = params.type;
    this.assertOpts = params.assertOpts;
    this.deleteOpts = params.deleteOpts;
};

//------------------------------------------------------------------------
// Assert Exchange
Exchange.prototype.assert = function (assertOpts, channel, callback) {

    //------------------------------------------------------
    // Adjust arguments    
    callback = utilities.mapCallback(arguments, 3);
    assertOpts = Object.assign({}, defaultAssertOpts, this.assertOpts, assertOpts);

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
        .then(() => channel.assertExchange(this.name, this.type, assertOpts))

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
// Check Exchange
Exchange.prototype.check = function (channel, callback) {

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
        .then(() => channel.checkExchange(this.name))

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
// Delete Exchange
Exchange.prototype.delete = function (deleteOpts, channel, callback) {

    //------------------------------------------------------
    // Adjust arguments    
    callback = utilities.mapCallback(arguments, 3);
    deleteOpts = Object.assign({}, defaultDeleteOpts, this.deleteOpts, deleteOpts);

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
        .then(() => channel.deleteExchange(this.name, deleteOpts))

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
// Bind Exchange
Exchange.prototype.bind = function (exchange, pattern, args, channel, callback) {

    //------------------------------------------------------
    // Adjust arguments    
    callback = utilities.mapCallback(arguments, 5);

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
        .then(() => this.assert(channel))
        .then(() => exchange.assert(channel))
        .then(() => channel.bindExchange(this.name, exchange.name, pattern, args))

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
// Unbind Exchange
Exchange.prototype.unbind = function (exchange, pattern, args, channel, callback) {

    //------------------------------------------------------
    // Adjust arguments    
    callback = utilities.mapCallback(arguments, 5);

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
        .then(() => channel.unbindExchange(this.name, exchange.name, pattern, args))

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
module.exports = Exchange;


