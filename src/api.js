import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:8000');

function subscribeToTimer(cb) { // cb stands for callback function
    socket.on('timer', timestamp => cb(null, timestamp));
    socket.emit('subscribeToTimer', 1000);
}

function rcvStrokes(cb) {
    socket.on('newStrokeRcv', item => cb(item));
}

function sndStrokes(item) {
    socket.emit('newStrokeSnd', item);
}

function getCategories(cb) {
    socket.emit('categories', data => cb(data));
    socket.on('categories', (data) => {
        cb(data);
    })
}

function checkIfCategoryExists(data, cb) {
    socket.emit('newCategoryCheck', data);
    socket.on('newCategoryFail', (data) => {
        cb(data);
    })

}

export { subscribeToTimer };
export {rcvStrokes};
export {sndStrokes};
export {getCategories};
export {checkIfCategoryExists};
