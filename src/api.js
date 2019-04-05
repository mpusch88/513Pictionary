import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:8000');

//----------------- Example -----------------//
function subscribeToTimer(cb) { // cb stands for callback function
    socket.on('timer', timestamp => cb(null, timestamp));
    socket.emit('subscribeToTimer', 1000);
}

//----------------- Sketchpad related -----------------//
function rcvStrokes(cb) {
    socket.on('newStrokeRcv', item => cb(item));
}

function sndStrokes(item) {
    socket.emit('newStrokeSnd', item);
}

//----------------- Game logic related -----------------//
function game_myReady(username) {
    socket.emit('newReadyPlayer', username);
}

function game_otherReady(cb) {
    socket.on('newReadyPlayer', username => cb(username));
}

//----------------- Login -----------------//
function send_loginfo(info, cb) {
    socket.on('login_flag', log_flag => cb(log_flag));
    socket.emit('new_loginfo', info);
}

function getCategories(cb) {
    socket.emit('categories', data => cb(data));
    socket.on('categories', (data) => {
        cb(data);
    });
}

function checkIfCategoryExists(data, cb) {
    socket.emit('newCategoryCheck', data);
    socket.on('newCategoryFail', (data) => {
        cb(data);
    });

}

function saveNewCategoryOrWord(data, cb) {
    socket.emit('storeNewCategory', data);
}

export { subscribeToTimer };
export {rcvStrokes};
export {sndStrokes};
export {game_myReady};
export {game_otherReady};
export {send_loginfo};
export {getCategories};
export {checkIfCategoryExists};
export {saveNewCategoryOrWord};