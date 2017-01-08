var utilities = require('../lib/utilities');

var foo = function(a, b, c, cb) {

    cb = utilities.mapCallback(arguments, 4);
    console.log(arguments);
    console.log(a,b,c);
    cb(b);
};

foo('hehe', (msg) => {
    console.log(msg);
});