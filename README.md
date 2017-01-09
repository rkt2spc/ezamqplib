# ezamqplib

Simple to use AMQP (0.9.1) Javascript Client - built while working with RabbitMQ

 * [Examples](https://github.com/rocketspacer/ezamqplib/tree/master/examples)
 * API Reference
 
It's written in 24 hours, so basically no testing yet. :D Looking for collaborators


### Features
```javascript
npm install ezamqplib
```

 * Wrap around the low API level **[amqp.node](https://github.com/squaremo/amqp.node)** library  
 * Modeled by amqp structural concepts: **Provider**, **Exchange**, **Queue**, **Consumer**  
 * Support BOTH **Callback** style and **Promise** programing style


### Usage
Here is the basic Hello-World sample. You can find more sample in the [examples](https://github.com/rocketspacer/ezamqplib/tree/master/examples) section.   
No, It is not synchronous so you don't have to worry about anything blocking your thread (Use Promises heavily in the back)  

```javascript
var amqp = require('ezamqp');
var uri = 'amqp://guest:guest@localhost';
//------------------------------------------------------------------------
amqp.initialize(uri, socketOptions, (err) => { //connected }); // Return a promise so you can chain It along, or use the callback (It is an optional param), your choice

//------------------------------------------------------------------------
var queue = new amqp.Queue({ name: 'my-first-queue', assertOpts: { durable: true }, deleteOpts: {} });
var consumer = new amqp.Consumer(queueA, { noAck: true });
consumer.consume();

var exchange = new amqp.Exchange({ name: 'my-first-exchange', type: 'direct', assertOpts: { durable: false }});
queue.bind(exchange, '');


consumerA.on('message', (msg) => {
    console.log('ConsumerA received:', msg);
});

//------------------------------------------------------------------------
var provider = new amqp.Provider();
provider.publish(exchange, '', 'My first message');

```

Coded with Love <3

