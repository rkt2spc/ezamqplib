var amqp = require('amqplib');
//------------------------------------------------------------------------
var connPromise = Promise.reject('Uninitialized');
connPromise.catch(() => {}); // So we don't have unhandled promise rejection warning


//------------------------------------------------------------------------
// Exports
module.exports = {
    initialize: function (uri, done = () => { }) {
        connPromise = amqp.connect(uri);
        connPromise
            .then((conn) => done())
            .catch((e) => done(e));
    },
    createChannel: function (callback) {
        return connPromise
            .then((conn) => conn.createChannel())
            .then((channel) => {
                channel.id = require('shortid').generate();
                console.log('channel created', channel.id);
                channel.once('error', (e) => console.log('channel error', channel.id, e)); // Silence the devil
                channel.once('close', (e) => console.log('channel close', channel.id)); // Silence the devil
                
                if (callback) callback(null, channel);
                return channel;
            })
            .catch((error) => {
                if (callback) callback(error);
                return error;
            });
    }
};