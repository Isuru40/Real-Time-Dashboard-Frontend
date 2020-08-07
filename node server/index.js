// const http = require('http');

// const server = http.createServer((request, response) => {
//     response.writeHead(200, {"Content-Type": "text/plain"});
//     response.end("Hello World!");
// });

// const port = process.env.PORT || 1337;
// server.listen(port);

// console.log("Server running at http://localhost:%d", port);
const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Kafka = require('no-kafka');
var databind;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

io.on('connection', (socket) => {
    console.log('USER CONNECTED');
    socket.on('disconnect', () => {
        console.log('USER DISCONNECTED');
    });
});

app.use('/server', require('./route'));

const port = process.env.PORT || 1337;

http.listen(port, (databind) => {
    console.log('started on port :%d',port);
    prod().catch(error => {
        console.log(error);
    });
    con().catch(error => {
        console.log(error);
    });
});

async function con() {
    const consumer = new Kafka.SimpleConsumer({
		
		connectionString: 'kafka://34.71.115.91:9092'
	});
// data handler function can return a Promise
    const dataHandler = (messageSet, topic, partition) => {
        messageSet.forEach(m => {
           console.log(topic, partition, m.offset, m.message.value.toString('utf8'));
			// console.log(topic, partition, m.offset, m.message);
            if (topic === 'test') {
               io.emit('message', {x: (new Date()), y: m.message.value.toString('utf8')});
            }
        });
    };
    return consumer.init().then(() => {
        // Subscribe partitions 0 and 1 in a topic:
        return consumer.subscribe('test', [0, 1], dataHandler);
    });
}

async function prod() {
    const producer = new Kafka.Producer({
		connectionString: 'kafka://34.71.115.91:9092'
	});
    return producer.init().then(() => {
        io.on('connection', (socket) => {
            socket.on('add-message', (data) => {
                return producer.send({
                    topic: 'nodered',
                    partition: 0,
                    message: {
                        value: data
                    }
                });

            });
        });
    })
        .then(result => {
            /*
            [ { topic: 'kafka-test-topic', partition: 0, offset: 353 } ]
            */
        });
}

