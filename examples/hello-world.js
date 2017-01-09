var amqp = require('../index');
var uri = 'amqp://krcihysa:j-_iaJkdSKNHOK7SjsVXLAZG6hzHG5kL@hyena.rmq.cloudamqp.com/krcihysa';
//------------------------------------------------------------------------
amqp.initialize(uri); // Optional callback

//------------------------------------------------------------------------
// Receiver side
var queue = new amqp.Queue({ name: 'my-first-queue', assertOpts: { durable: true }, deleteOpts: {} });
var consumer = new amqp.Consumer(queue, { noAck: true });

consumer.consume();
consumer.on('message', (msg) => {
    console.log('Message received:', msg);
    // consumer.cancel();
});

//------------------------------------------------------------------------
// Provider side
var provider = new amqp.Provider();
provider.sendToQueue(queue, 'SOME MESSAGE');