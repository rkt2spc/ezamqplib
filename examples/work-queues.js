var amqp = require('../index');
var uri = 'amqp://krcihysa:j-_iaJkdSKNHOK7SjsVXLAZG6hzHG5kL@hyena.rmq.cloudamqp.com/krcihysa';
//------------------------------------------------------------------------
amqp.initialize(uri); // Optional callback

//------------------------------------------------------------------------
// Receiver side
var queue = new amqp.Queue({ name: 'my-first-queue', assertOpts: { durable: true }, deleteOpts: {} });
var consumerA = new amqp.Consumer(queue, { noAck: true });
var consumerB = new amqp.Consumer(queue, { noAck: true });

consumerA.consume();
consumerA.on('message', (msg) => {
    console.log('ConsumerA received:', msg);
});

consumerB.consume();
consumerB.on('message', (msg) => {
    console.log('ConsumerB received:', msg);
});

//------------------------------------------------------------------------
// Provider side
var provider = new amqp.Provider();
provider.sendToQueue(queue, '1');
provider.sendToQueue(queue, '2');
provider.sendToQueue(queue, '3');
provider.sendToQueue(queue, '4');
provider.sendToQueue(queue, '5');
