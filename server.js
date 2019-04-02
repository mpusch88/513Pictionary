
const io = require('socket.io')();

io.on('connection', (client) => {
    client.on('subscribeToTimer', (interval) => {
        console.log('client is subscribing to timer with interval ', interval);
        setInterval(() => {
            client.emit('timer', new Date());
        }, interval);
    });

    client.on('newStrokeSnd', (item) =>{
        // probably change to broadcasting to a room, if we still want multiple rooms
        client.broadcast.emit('newStrokeRcv', item);
    })
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);
