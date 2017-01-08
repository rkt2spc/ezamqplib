var amqp = require('../index');

// var opts = {
//     exchangeName: 'e001',
//     exchangeType: 'direct',
//     exchangeOpts: { durable: true },

//     queueName: 'q001',
//     queueOpts: { durable: true },

//     bindPattern: '',

//     routingKey: '',
//     publishOpts: {},

//     consumeOpts: { noAck: true }
// };

var uri = 'amqp://krcihysa:j-_iaJkdSKNHOK7SjsVXLAZG6hzHG5kL@hyena.rmq.cloudamqp.com/krcihysa';
amqp.initialize(uri);

var ex1 = new amqp.Exchange({ name: 'ex1', type: 'direct', opts: { durable: true } });
var ex2 = new amqp.Exchange({ name: 'ex2', type: 'direct', opts: { durable: true } });

var queue = new amqp.Queue({ name: 'my-first-queue', opts: { durable: true } });
var provider = new amqp.Provider();
var consumer = new amqp.Consumer(queue, { opts: { noAck: true } });

consumer.on('message', (msg) => {
    console.log('Message received:', msg);
    consumer.stopConsume();
});
consumer.startConsume();


amqp.createChannel((err, channel) => {
    queue.bind(ex1, '', channel, () => { });
    queue.bind(ex2, '', channel, () => { });
    
    
    provider.publishTo(ex1, { opts: {}, message: 'Ex1MSG', routingKey: '' }, channel, (e) => { console.log('ex1 published', e); });
    provider.publishTo(ex2, { opts: {}, message: 'Ex2MSG', routingKey: '' }, channel, (e) => { console.log('ex2 published', e); });    
});

// amqp.createChannel((err, channel) => {


//     // provider.sendTo(queue)

// });