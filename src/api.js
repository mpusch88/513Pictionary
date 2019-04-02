import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:8000');

function subscribeToTimer(cb) { // cb stands for callback function
    socket.on('timer', timestamp => cb(null, timestamp));
    socket.emit('subscribeToTimer', 1000);
}

function addStrokes(cb, data) {
    socket.on('addStrokes', item => cb(null, item));
    socket.emit('newStroke', data);
}

export { subscribeToTimer };
export {addStrokes};
