var lodash = require('lodash');
var mq = require('./mq');
module.exports = {
    mapCallback: function(args, real_length) {
        
        if (args.length >= real_length) return args[real_length - 1];    
        if (args.length <= 0 || real_length <= 0) return undefined;

        var callback;
        if (args.length < real_length) {
            if (lodash.isFunction(args[args.length - 1])) {
                callback = args[args.length - 1];
                args[args.length - 1] = undefined;
            }
        }
        return callback;
    },
    exec: function(channel, callback, operation) {
        var newChannel = false;
        return Promise.resolve(true)
            .then(() => {
                if (channel) return channel;
                
                newChannel = true;
                return mq.createChannel(); 
            })
            .then(;
    },
    pipeBack: function(callback) {
        return Promise.resolve(true)
            .then(() => {

            });
    }
};