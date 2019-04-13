let app = require('express')();
let express = require('express');
let server = require('http').Server(app);
let MongoClient = require('mongodb').MongoClient;


let users = {};

let userListPerRoom = {};
let rooms = [];
let roomInfo = {};
let categories = [];
let categoryTypes = [];
let categoryToWords = {};

app.use('/assets', express.static(__dirname + '/dist'));
const io = require('socket.io')(server);

// connect to mongo and store all categories w/ answers in categories list
const uri = 'mongodb+srv://513Administrator:zAiKscXwdMZaX7FP@513cluster-qiybs.mongodb.net/tes' +
	't?retryWrites=true';
const client = new MongoClient(uri, { useNewUrlParser: true });

// getting all categories from database
client.connect(() => {
	const collection = client
		.db('pictionary')
		.collection('categories');

	let rawCategories = collection
		.find()
		.toArray((err, items) => {
			categories = items;
			items.forEach(function(arrayItem) {
				categoryTypes.push(arrayItem.type);
				categoryToWords[arrayItem.type] = arrayItem[arrayItem.type];
			});
		});

	// not exported?
	client.close();
});

let getUsers = () => {
	return Object
		.keys(users)
		.map(function(key) {
			return users[key].username;
		});
};



// --------- Helper functions for chat message -------------------//

let createSocket = (user) => {
	let current_user = users[user.id],
		updated_user = {
			[user.id]: Object.assign(current_user, {
				sockets: [
					...current_user.sockets,
					user.socket_id
				]
			})
		};
	users = Object.assign(users, updated_user);
};

let createUser = (user) => {
	users = Object.assign({
		[user.id]: {
			username: user.username,
			id: user.id,
			sockets: [user.socket_id]
		}
	}, users);
};

let removeSocket = (socket_id) => {
	let id = '';

	Object
		.keys(users)
		.map(function(key) {
			let sockets = users[key].sockets;
			if (sockets.indexOf(socket_id) !== -1) {
				id = key;
			}
		});

	let user = users[id];

	if (user.sockets.length > 1) {
		let index = user
			.sockets
			.indexOf(socket_id);
		let updated_user = {
			[id]: Object.assign(user, {
				sockets: user
					.sockets
					.slice(0, index)
					.concat(user.sockets.slice(index + 1))
			})

		};
		users = Object.assign(users, updated_user);
	} else {
		let cuser = Object.assign({}, users);
		delete cuser[id];
		users = cuser;
	}
};


// ------------------- helper function for admin page -----------------//

// store new category and word

let storeCategoryAndWord = (data) => {
	let clientDriver = new MongoClient(uri, { useNewUrlParser: true });

	clientDriver.connect(err => {
		const collection = clientDriver
			.db('pictionary')
			.collection('categories');

		let type = data.category;
		let word = data.word;

		var obj = {
			type: type,
			[type]: word
		};

		collection.insertOne(obj, function(err, res) {
			if (err)
				throw err;
		});
	});

	clientDriver.close();
};

let addWordToExistingCategory = (data) => {
	let clientDriver = new MongoClient(uri, { useNewUrlParser: true });
	clientDriver.connect(err => {
		const collection = clientDriver
			.db('pictionary')
			.collection('categories');
		let type = data.category;
		let word = data.word;
		var obj = {
			type: type
		};

		console.log(obj);
		collection.updateOne({
			obj
		}, {
			$addToSet: {
				[type]: word
			}
		}, function(err, res) {
			if (err)
				throw err;
		});
	});

	clientDriver.close();
};


//---------------- general helper functions -------------------------//

let getUniqueId = function() {

	// Math.random should be unique because of its seeding algorithm. Convert it to
	// base 36 (numbers + letters), and grab the first 9 characters after the
	// decimal.

	return '_' + Math
		.random()
		.toString(36)
		.substr(2, 9);
};



// ------------------- Helper function for Removing from userList ----------------------//

let removeFromUserList = (roomId, username) => {
	/// Remove from userList
	if (userListPerRoom[roomId]) {
		let list = userListPerRoom[roomId];
		for (var i in list) {
			if (list[i].username === username) {
				list.splice(i, 1);
			}
		}

		userListPerRoom[roomId] = list;
	}
};








//########----------- on socket connection --------------------###########/

io.on('connection', (socket) => {
	// TODO: check if it's a reconnection

	socket.on('init-chat', (query) => {
		//let query = socket.request._query,
		let user = {
			username: query.username,
			id: query.id,
			socket_id: socket.id
		};

		// If incoming user connection is new, create a new user id and username
		// otherwise, use the fetched data and update the userlist
		if (users[user.id] !== undefined) {

			// console.log("USER ID: " + user.id); console.log("Users list: " +
			// users[user.id]);
			createSocket(user);
			socket.emit('updateUsersList', getUsers());
		} else {

			// console.log("Creating new user: " + user + " with id of: " + user.id);
			createUser(user);
			io.emit('updateUsersList', getUsers());
		}
	});

	//--------------UPDATE USER INFO---------------------//

	socket.on('update_userinfo', (info) => {
		console.log('User info update requested!');
		console.log(info.email);
		console.log(info.username);

		if (info.cpsw === info.npsw) {
			var client1 = new MongoClient(uri, { useNewUrlParser: true });

			client1.connect(() => {
				const collection = client1
					.db('pictionary')
					.collection('users');

				collection.find({
					email: info.email,
					username: info.username
				}).toArray(function(err, res) {

					if (res[0].password === info.psw) {
						let updateresult = {};

						updateresult = collection.updateOne( //update first entry that matches
							{
								'username': info.username,
								'email': info.email
							},

							{
								$set: { 'password': info.npsw }
							});

						if (updateresult) {
							console.log('Update successful');
							socket.emit('update_flag', { type: 'success' });
						} else {
							console.log('Update failed');
							socket.emit('update_flag', { type: 'fail' });
						}
					} else {
						socket.emit('update_flag', { type: 'fail' });
					}
				});
			});
		}
	});

	//------------------------- Login -------------------------//

	socket.on('new_loginfo', (info) => {
		console.log('login req');

		var client1 = new MongoClient(uri, { useNewUrlParser: true });

		client1.connect(err => {
			const collection = client1
				.db('pictionary')
				.collection('users');

			var myobj = {
				email: info.email,
				password: info.psw
			};

			collection.find(myobj).toArray(function(err, res) {
				if (res && res.length !== 0) {
					if (res[0].isAdmin === '1') {
						console.log('admin logged in');
						console.log(res[0].email);

						socket.emit('login_flag', {
							type: 'admin',
							username: res[0].username,
							email: res[0].email
						});

						socket.username = res[0].username;

					} else if (res[0].isAdmin === '0') {
						socket.emit('login_flag', {
							type: 'user',
							username: res[0].username,
							email: res[0].email
						});

						socket.username = res[0].username;
						console.log('User logged in');
					}
				} else {
					socket.emit('login_flag', { type: 'fail' });
					console.log('failure');
				}
			});
		});
	});

	// Sign Up Handler
	socket.on('new_signupinfo', (info) => {
		console.log('signup');

		var client1 = new MongoClient(uri, { useNewUrlParser: true });

		client1.connect(err => {
			const collection = client1
				.db('pictionary')
				.collection('users');

			var myobj = { username: info.username };

			// Checks if either username, email or password is empty
			if(info.username.trim() === "" || info.email.trim() === "" || info.password === "") {
				console.log("empty username, email or password");
				socket.emit('signup_flag', {type: 'empty'});
			} else {
				// Javascript Email validation regex
				var emailformat = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
				if(!emailformat.test(info.email)){
					socket.emit('signup_flag', {type: 'email'});
				} else {
					collection.find(myobj).toArray(function(err, res) {
						if (res && res.length !== 0) {		// checks if the username has been taken
							console.log("username taken");
							socket.emit('signup_flag', {type: 'taken'});
						} else {
							// generate a random number in-between 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 for the profile image
							var min = 0;
							var max = 10;
							var random = Math.floor(Math.random() * (+max - +min)) + +min;  
							
							// insert data into the db
							var myobj = { username: info.username, password: info.psw, email: info.email, wins: 0, gameplayed: 0, isAdmin: '0', avatar: random};
							collection.insertOne(myobj, function(err, res) {
								if (err) throw err;
								console.log("inserted");
								socket.emit('signup_flag', {type: 'signed'});
							});
						}
					});
				}
			}

			
			
		});

	});

	// ------------------------- Login -------------------------//
	// ---------------------------- creating and join room
	// -----------------------------------------// lets socket join a room or create
	// one if it doesn't exist keep track of current rooms in socket io, join and
	// create room are a single function
	socket.on('join-room', function(data) {
		let roomsearch = io.sockets.adapter.rooms[data.room.id];

		console.log(roomsearch);

		if (rooms.includes(data.room.id)) {
			if (roomsearch && roomsearch.length < 5) {
				// join room
				socket.join(data.room.id);

				// updating capacity
				data.room.capacity = roomsearch.length + '/5';

				console.log('joined successfully in existing room');

				let userInfo = {
					username: data.username,
					score: 0,
					isDrawer: false,
					isReady: false
				};

				// emiting to all sockets in room for new user joining in
				// io.in(data.room.id).emit('newUserInRoom', userInfo);

				// adding user to room user list
				//Make array for key if doesn't exist
				userListPerRoom[data.room.id] = userListPerRoom[data.room.id] ? userListPerRoom[data.room.id] : [];
				//Add value to array
				userListPerRoom[data.room.id].push(userInfo);
				console.log("new join user, update list: ", userListPerRoom[data.room.id]);
				io.in(data.room.id).emit('entireUserList', userListPerRoom[data.room.id]);

			} else if (roomsearch) {
				data.room.capacity = roomsearch.length + '/5';
				socket.emit('full room', 'Room is full');
			}
		}

		// socket.broadcast.to(data.room.id).emit('message',
		// 	{type:'message', text: data.username + " just joined the room!"});

		roomInfo[data.room.id] = data.room;

		// to update capacity all sockets
		io.emit('updateRoomInfo', data.room);
	});

	//joining the room, creating an entry in the list
	socket.on('create-room', function(room) {
		let roomId = getUniqueId();

		while (rooms.includes(roomId)) {
			roomId = getUniqueId();
		}

		//pushing it to room list
		rooms.push(roomId);
		//joining room
		socket.join(roomId);
		//setting the id on return data
		room.id = roomId;
		let roomsearch = io.sockets.adapter.rooms[room.id];
		//should be 1
		room.capacity = roomsearch.length + '/5';
		roomInfo[roomId] = room;
		console.log('created new room ' + roomId + ' :' + room.capacity);
		socket.emit('sendRoomInfo', room);
		socket.broadcast.emit('newRoom', room);
		let userInfo = {
			username: room.username,
			score: 0,
			isDrawer: false,
			isReady: false
		};
		//Make array for key if doesn't exist
		userListPerRoom[roomId] = userListPerRoom[roomId] ? userListPerRoom[roomId] : [];
		//Add value to array
		userListPerRoom[roomId].push(userInfo);
		console.log("create new room, list: ", userListPerRoom[roomId]);
		socket.emit('entireUserList', userListPerRoom[roomId]);
	});

	//get all the rooms
	socket.on('room-list', function(data) {
		let roomList = [];
		for (var key in roomInfo) {
			roomList.push(roomInfo[key]);
		}

		socket.emit('all-rooms', roomList);
	});


	//leave game room event
	socket.on('leave-room', function(data) {
		let roomsearch = io.sockets.adapter.rooms[data.id];
		let room = roomInfo[data.id];

		console.log('leaving room with id ' + data.id);

		if (roomsearch) {
			room.capacity = roomsearch.length - 1 + '/5';
			roomInfo[data.id] = room;
			console.log('leaving room ' + room.capacity);
		}


		/// Remove from userList
		removeFromUserList(data.id, data.username);


		//leave room
		socket.leave(data.id);


		io.emit('updateRoomInfo', room);

		socket.emit('sendRoomInfo', room);

		io.in(data.id).emit('entireUserList', userListPerRoom[data.id]);

		console.log('User leaves: ', userListPerRoom[data.id]);

	});

	///---------------------- GAME ROOM ACTIVITY NEED TO HAPPEN WITH socket room------------------////


	socket.on('getUserList', (data) => {
		console.log('send user list', userListPerRoom[data.id]);
		socket.emit('userList', userListPerRoom[data.id]);
	});

	// received new stroke from the drawer, emit to guessers
	socket.on('newStrokeSnd', (data) => {
		//broadcasting to everyone in room
		socket
			.broadcast
			.to(data.roomId)
			.emit('newStrokeRcv', data.item);
	});

	// receive user ready event, emit to other players
	socket.on('imReady', data => {
		console.log('User: ' + data.username + ' is ready');
		io.in(data.roomId).emit('newReadyPlayer', data.username);
	});

	// emits message to all users in the room add functionality to verify answer on
	// each message receive
	socket.on('message', function(data) {
		console.log('room id passed in : ' + data.roomId);
		console.log(socket.id);

		let roomsearch = io.sockets.adapter.rooms[data.roomId];

		console.log(roomsearch);

		//to room sockets
		let rooms = Object.keys(socket.rooms);
		console.log(rooms); // [ <socket.id>, 'room 237' ]

		//io.in(data.roomId).emit('message', data);

		socket
			.broadcast
			.to(data.roomId)
			.emit('message', data);
		// socket.broadcast.emit('message', data);
		//TODO - add function to check message with answer
	});

	// //emits message to all users in the room //add functionality to verify answer
	// on each message receive socket.on('message', function(msg) { 	//
	// io.in(room).emit('message',msg);
	//
	// 	socket.broadcast.to(msg.roomId).emit('message', msg.msq);
	//
	// 	//socket.broadcast.emit('message', msg); 	//TODO - add function to check
	// message with answer }); Receives image from socket and emits to all other
	// sockets in that room socket.on('receive image', function (image) {
	// socket.broadcast.to(room).emit(image); }); Handles socket disconnection and
	// possible room deletion when disconnecting socket is last one in room Updates
	// users list on user disconnect
	socket.on('disconnect', () => {
		//	removeSocket(socket.id);
		io.emit('updateUsersList', getUsers());
	});

	// ---------------- Admin page --------------------// this is for testing right
	// now, need to fetch from DB
	socket.on('categories', (data) => {
		let cats = [];
		categories.forEach(function(arrayItem) {
			cats.push(arrayItem.type);
		});

		socket.emit('categories', cats);
	});

	socket.on('newCategoryCheck', (data) => {
		if (categoryTypes.includes(data.toLowerCase())) {
			socket.emit('newCategoryFail', { error: 'Category Already Exists' });
		}
	});

	socket.on('storeNewCategory', (data) => {
		console.log(data);

		if (data.existingCategory) {
			if (!categoryToWords[data.existingCategory].includes(data.word)) {
				console.log(data.word);
				addWordToExistingCategory({ category: data.existingCategory, word: data.word });
			}
		} else {
			storeCategoryAndWord({ category: data.newCategory, word: data.word });
		}
	});

	// -----------------  Dashboard ---------------------------//

	// TODO: socket disconnection


	//------------------------------ Logout ----------------------------------------------------//

	socket.on('logout', (data) => {

		let temp = Object.keys(io.sockets.adapter.sids[socket.id]);
		let allRoomsForSocket = temp.slice(1);

		//console.log(allRoomsForSocket);

		for (var i in allRoomsForSocket) {

			//  console.log("Before  logout: ", userListPerRoom[allRoomsForSocket[i]]);
			removeFromUserList(allRoomsForSocket[i], socket.username);

			//  console.log("After logout: ", userListPerRoom[allRoomsForSocket[i]]);
			io.in(allRoomsForSocket[i]).emit('entireUserList', userListPerRoom[allRoomsForSocket[i]]);
		}



	});




	///---------------------------ON DISCONNECT ---------------------------------------------//


	/// on disconnect , socket already leaves all the rooms it was in , no need to do it manually
	socket.on('disconnect', (data) => {
		// socket disconnected, set a timeout for reconnection



		console.log("inside disconnect");

		// remove all rooms
		console.log("Socket id: ", socket.id);
		console.log("UserName : ", socket.username);


		for (const [roomId, userList] of Object.entries(userListPerRoom)) {
			console.log(roomId);

			for (var i in userList) {
				if (userList[i].username === socket.username) {

					console.log("Before  logout: ", userListPerRoom[roomId]);
					removeFromUserList(roomId, socket.username);

					// inform other players in the room
					io.in(roomId).emit('entireUserList', userListPerRoom[roomId]);

					console.log("After logout: ", userListPerRoom[roomId]);
				}

			}
		}

	});
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);
