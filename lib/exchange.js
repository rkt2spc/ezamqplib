var mq = require('./mq');

var Exchange = function (params) {
    this.name = params.name;
    this.type = params.type;
    this.opts = params.opts;

    this.promises = {
        assert: undefined
    };
};

//------------------------------------------------------------------------
// Assert Exchange
Exchange.prototype.assert = function(channel, callback) {

    if (!this.promises.assert || this.promises.assert.isRejected()) {
        
        this.promises.assert = (channel)? 
            channel.assertExchange(this.name, this.type, this.opts) : mq.createChannel().then((ch) => ch.assertExchange(this.name, this.type, this.opts));

        this.promises.assert
            .then((ok) => {
                if (callback) callback(null, ok);
                return ok;
            })
            .catch((error) => {
                if (callback) callback(error);
                return error;
            });
    }

    return this.promises.assert;    
};

//------------------------------------------------------------------------
// Check Exchange

//------------------------------------------------------------------------
// Delete Exchange

//------------------------------------------------------------------------
// Bind Exchange

//------------------------------------------------------------------------
// Unbind Exchange

//------------------------------------------------------------------------
// Exports
module.exports = Exchange;


