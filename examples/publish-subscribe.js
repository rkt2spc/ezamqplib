var amqp = require('../index');
var uri = 'amqp://krcihysa:j-_iaJkdSKNHOK7SjsVXLAZG6hzHG5kL@hyena.rmq.cloudamqp.com/krcihysa';
//------------------------------------------------------------------------
amqp.initialize(uri); // Optional callback

//------------------------------------------------------------------------
var queueA = new amqp.Queue({ name: 'my-first-queue', assertOpts: { durable: true }, deleteOpts: {} });
var consumerA = new amqp.Consumer(queueA, { noAck: true });
consumerA.consume();

var queueB = new amqp.Queue({ name: 'my-second-queue', assertOpts: { durable: true }, deleteOpts: {} });
var consumerB = new amqp.Consumer(queueB, { noAck: true });
consumerB.consume();

var exchange = new amqp.Exchange({ name: 'my-first-exchange', type: 'fanout', assertOpts: { durable: false }});
queueA.bind(exchange, '');
queueB.bind(exchange, '');


consumerA.on('message', (msg) => {
    console.log('ConsumerA received:', msg);
});

consumerB.on('message', (msg) => {
    console.log('ConsumerB received:', msg);
});

//------------------------------------------------------------------------
// Provider side
var provider = new amqp.Provider();
provider.publish(exchange, '', 'All consumer should receive this message');
provider.publish(exchange, '', 'The same for this message');
