import openSocket from 'socket.io-client';
// export const socket = openSocket('http://10.13.129.81:8000');
export const socket = openSocket('http://localhost:8000');

//----------------- Example -----------------//
function subscribeToTimer(cb) { // cb stands for callback function
    socket.on('timer', timestamp => cb(null, timestamp));
    socket.emit('subscribeToTimer', 1000);
}



// -------------------Log out ---------------------------//

export function logout(data){
	socket.emit('logout', data);
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

// --------------------  Chat inside Game ----------------------------//

export function initializeChat(data) {
	socket.emit('init-chat', data);
}
export function updateUserList(cb) {

	socket.on('updateUsersList', list => cb(list));
}

export function getNewUserJoin(cb){
	socket.on('newUserInRoom', data => cb(data));
}


export function getUserList(data, cb){
	socket.emit('getUserList', data);
	socket.on('userList', list => cb(list));
}


export function rcvMessage(cb) {

	socket.on('message', data => cb(data));
}

export function sendMessageEvent(data, cb) {
	socket.emit('message', data);
}

//----------------- Login -----------------//
// function send_loginfo(info) {
// 	socket.emit('new_loginfo', info);
// }
function send_loginfo(info) {
	socket.emit('new_loginfo', info);
}

//--------USER HISTORY-------------------//
export function update_userhistory(info, cb) {
	socket.emit('update_userhistory', info);
	socket.on('receive-answer', (ans) => {
		cb(ans);
	});
}

//----------------- Sign Up -----------------//
function send_signupinfo(info) {
    socket.emit('new_signupinfo', info);
}

//--------------USER INFO--------------------//
function update_userinfo(info) {
	socket.emit('update_userinfo', info);
}

//------------------ Admin page-----------------//
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

//-------------Dashboard --------------------//

function createRoom(data, cb) {
	socket.emit('create-room', data);
}

function joinRoom(data, cb) {
	socket.emit('join-room', data);
}

function leaveRoom(data, cb) {
	socket.emit('leave-room', data);
}

function getRoomInfo(data, cb) {
	socket.on('sendRoomInfo', (data) => {
		cb(data);
	});
}

export function getNewRoom(data, cb) {
	socket.on('newRoom', (data) => {
		cb(data);
	});
}

export function updateRoomInfo(data, cb) {
	socket.on('updateRoomInfo', (data) => {
		cb(data);
	});
}

function getAllExistingRooms(cb) {
	socket.emit('room-list');
	socket.on('all-rooms', (data) => {
		cb(data);
	});
}

export function setAnswer(data, cb){
	socket.emit('pick-answer', data);
	socket.on('receive-answer', (ans) => {
		cb(ans);
	});
}

/*--------------Cynthia updates--------------*/
function joinRoomUpdateUserList(cb){
    socket.on('joinRoomUpdateUserList', username => {
        cb(username);
    });
}

/*--------------Cynthia updates--------------*/



export { subscribeToTimer };
export { rcvStrokes };
export { sndStrokes };
export { game_myReady };
export { game_otherReady };
export { update_userinfo };
export { send_loginfo };
export { send_signupinfo };
export { getCategories };
export { checkIfCategoryExists };
export { saveNewCategoryOrWord };
export { joinRoom };
export { leaveRoom };
export { createRoom };
export { getRoomInfo };
export { getAllExistingRooms };
