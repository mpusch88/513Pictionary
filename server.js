
const io = require('socket.io')();


const categories = ['ANIMAL', 'BODY PARTS', 'MOVIE', 'OBJECT'];

io.on('connection', (client) => {

    //this is for testing right now, need to fetch from DB
    client.emit("categories", categories);

    client.on('subscribeToTimer', (interval) => {
        console.log('client is subscribing to timer with interval ', interval);
        setInterval(() => {
            client.emit('timer', new Date());
        }, interval);
    });

    client.on('newStrokeSnd', (item) =>{
        // probably change to broadcasting to a room, if we still want multiple rooms
        client.broadcast.emit('newStrokeRcv', item);
    });


    client.on('newCategoryCheck', (data) => {
        if (categories.includes(data.toUpperCase())) {
            console.log("category already exists")
            client.emit("newCategoryFail", {error: 'Category Already Exists'})
        }
    });
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);
