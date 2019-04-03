let app = require('express')();
let express = require('express');
let server = require('http').Server(app);
let MongoClient = require('mongodb').MongoClient;
let users = {};
let rooms = [];
let categories = [];

app.use('/assets', express.static(__dirname + '/dist'));

const io = require('socket.io')(server);

//connect to mongo and store all categories w/ answers in categories list
const uri = "mongodb+srv://513Administrator:zAiKscXwdMZaX7FP@513cluster-qiybs.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("pictionary").collection("categories");
  categories = collection.find().toArray((err,items) => {
	categories=items;
	console.log(categories)});
  client.close();
});

getUsers = () =>{
	return Object.keys(users).map(function(key){
		return users[key].username
	})
}

// Helper functions for chat message
let createSocket = (user) =>{
	let current_user = users[user.id],
		updated_user = {
			[user.id] : Object.assign(current_user, {sockets: [...current_user.sockets, user.socket_id]})
		};
	users = Object.assign(users, updated_user);
}

let createUser = (user) => {
	users = Object.assign({
		[user.id] : {
			username : user.username,
			id : user.id,
			socket : [user.socket_id]
		}
	}, users);
}

let removeSocket = (socket_id) => {
	let id = '';
	Object.keys(users).map(function(key){
		let sockets = users[key].sockets;
		if(sockets.indexOf(socket_id) !== -1){
			id = key;
		}
	});
	let user = users[id];
	if(user.sockets.length > 1){
		let index = user.sockets.indexOf(socket_id);
		let updated_user = {
			[id] : Object.assign(user, {
				sockets : user.sockets.slice(0,index).concat(user.sockets.slice(index+1))
			})
		};
		users = Object.assign(users, updated_user);
	}
	else{
		let cuser = Object.assign({}, users);
		delete cuser[uid];
		users = cuser;
	}
}

io.on('connection', (socket) => {
	console.log("USER CONNECTED");

    let query = socket.request._query,
  		user = {
  			username : query.username,
  			id : query.id,
  			socket_id : socket.id
  		};

  	//If incoming user connection is new, create a new user id and username
  	// otherwise, use the fetched data and update the userlist
  	if(typeof users[user.uid] !== 'undefined'){
		console.log("Creating socket for user id: "+users[user.id].sockets);
  		createSocket(user);
  		socket.emit('updateUsersList', getUsers());
  	}
  	else{
  		createUser(user);
  		io.emit('updateUsersList',getUsers());
	  }
	  
	  socket.on('subscribeToTimer', (interval) => {
	console.log('client is subscribing to timer with interval ', interval);
	setInterval(() => {
		socket.emit('timer', new Date());
	}, interval);
    });

    socket.on('newStrokeSnd', (item) =>{
        // probably change to broadcasting to a room, if we still want multiple rooms
        socket.broadcast.emit('newStrokeRcv', item);
    })

  	//lets socket join a room or create one if it doesn't exist
  	//keep track of current rooms
  	//in socket io, join and create room are a single function
  	socket.on('join-create room', function(room){
  		let roomsearch = io.sockets.adapter.rooms[room];
  		if(!roomsearch.length>5){
  			if(!rooms.includes(room))
  				rooms.push(room);
				  socket.join(room);
  		}
  		else{
			socket.emit('full room', "Room is full");
  		}
  	});

  	//emits message to all users in the room
  	//add functionality to verify answer on each message receive
  	socket.on('message', function(msg){
  		io.in(room).emit('message',msg);
  		//TODO - add function to check message with answer
  	});

  	//Receives image from socket and emits to all other sockets in that room
  	socket.on('receive image', function(image){
		socket.broadcast.to(room).emit(image);
  	});

  	//Handles socket disconnection and possible room deletion when disconnecting socket is last one in room
  	//Updates users list on user disconnect
  	socket.on('disconnect', () => {
  		removeSocket(socket.id);
  		io.emit('updateUsersList', getUsers());
  	});


});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);
