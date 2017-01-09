var mq = require('./mq');
var utilities = require('./utilities');
var Exchange = require('./exchange');
var Queue = require('./queue');

//------------------------------------------------------------------------
var defaultPublishOpts = {
    expiration: '30000',
    userId: undefined, // username
    CC: [], // Additional routing key,
    priority: undefined, // Positive interger
    persistent: true, // Like durable
    mandatory: false, // Return message if there are no recipients
    BCC: undefined, // Like CC but doesnt put in headers
    contentType: 'application/json',
    contentEncoding: 'utf-8',
    replyTo: undefined, // For RPC model
    messageId: undefined, // Application specific identifier for message
    timestamp: undefined, // Positive Number
    appId: undefined // Arbitray identifier for originating application
};

//========================================================================
// Provider 
//========================================================================
var Provider = function (publishOpts) { 
    this.publishtOpts = publishOpts;
};

//------------------------------------------------------------------------
// Provider Publish
Provider.prototype.publish = function (exchange, routingKey, content, publishOpts, channel, callback) {

    //------------------------------------------------------
    // Adjust arguments    
    callback = utilities.mapCallback(arguments, 6);
    publishOpts = Object.assign({}, defaultPublishOpts, this.publishtOpts, publishOpts);
    if (!(content instanceof Buffer)) content = Buffer.from(content.toString());

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
        .then(() => exchange.assert(channel))
        .then(() => channel.publish(exchange.name, routingKey, content, publishOpts))

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
// Provider Send to Queue
Provider.prototype.sendToQueue = function (queue, content, sendOpts, channel, callback) {

    //------------------------------------------------------
    // Adjust arguments    
    callback = utilities.mapCallback(arguments, 5);
    sendOpts = Object.assign({}, defaultPublishOpts, this.publishOpts, sendOpts);

    //------------------------------------------------------
    if (!(queue instanceof Queue))
        throw new TypeError('Provider.sendToQueue expect Type Queue');
    if (!(content instanceof Buffer)) content = Buffer.from(content.toString());
    

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
        .then(() => queue.assert(channel))
        .then(() => channel.sendToQueue(queue.name, content, sendOpts))

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
module.exports = Provider;