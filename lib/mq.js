var amqp = require('amqplib');
var utilities = require('./utilities');
//------------------------------------------------------------------------
var connPromise = Promise.reject('Uninitialized');
connPromise.catch(() => {}); // So we don't have unhandled promise rejection warning

//------------------------------------------------------------------------
// Exports
module.exports = {
    initialize: function (uri, socketOptions, callback) {

        //------------------------------------------------------
        // Adjust arguments 
        callback = utilities.mapCallback(arguments, 3);

        //------------------------------------------------------
        connPromise = amqp.connect(uri, socketOptions);
        return connPromise
            .then((conn) => {
                if (callback) callback(null, conn);
                return conn;
            })
            .catch((error) => {
                if (callback) callback(error);
                return error;
            });
    },
    createChannel: function (callback) {
        
        return connPromise
            .then((conn) => conn.createChannel())
            .then((channel) => {
                channel.id = require('shortid').generate();
                // console.log('channel created', channel.id);
                channel.once('error', (e) => {}); //console.log('channel error', channel.id, e)); // Silence the devil
                channel.once('close', () => {}); //console.log('channel close', channel.id)); // Silence the devil
                
                if (callback) callback(null, channel);
                return channel;
            })
            .catch((error) => {
                if (callback) callback(error);
                return error;
            });
    }
};