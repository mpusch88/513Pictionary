
const io = require('socket.io')();

let users = [];

io.on('connection', (client) => {
    client.on('subscribeToTimer', (interval) => {
        console.log('client is subscribing to timer with interval ', interval);
        setInterval(() => {
            client.emit('timer', new Date());
        }, interval);
    });

    client.on('newStrokeSnd', (item) =>{
        client.broadcast.emit('newStrokeRcv', item);
    });


});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);
