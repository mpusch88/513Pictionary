var express = require('express');
var router = express.Router();
var db = require('./db.js');

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

    client.on('new_loginfo', (info) => {
        const collection = client
            .db('pictionary')
            .collection('users');

        var myobj = {email: info.email, password: info.psw};

        collection
            .find(myobj)
            .toArray(function (err, res) {
                if (res.length !== 0) {
                    client.emit('log_flag', true);
                    return;
                } else {
                    client.emit('log_flag', false);
                    return;
                }
            });

    });
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);
