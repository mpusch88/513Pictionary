var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb+srv://Ben:526817244@513cluster-qiybs.mongodb.net/test?retryWrites=true';
var client = new MongoClient(url, {useNewUrlParser: true});

module.exports = function () {}; // potentailly ok to use this function (db.js) inside the server??

client.connect(() => {
    var collection = client
        .db('pictionary')
        .collection('users');

    module.exports.signin = function (loginUsername, loginPassword, callback) {
        var status = -1;
        var myobj = {
            username: loginUsername,
            password: loginPassword
        };

        // Checks if either username, email or password is empty
        if (loginUsername.trim() === '' || loginPassword.trim() === '') {
            console.log('empty username or password');
            status = 0; // status is 0 when empty input errors happen
            callback(status);
            return;
        }

        collection
            .find(myobj)
            .toArray(function (err, res) {
                if (res.length !== 0) {
                    status = 1; // user exists
                    callback(status);
                    return;
                } else {
                    status = 3; // user doesn't exist
                    callback(status);
                    return;
                }
            });
    };

    module.exports.signup = function (signupUsername, signupEmail, signupPassword, callback) {
        var status = -1;

        // Checks if either username, email or password is empty
        if (signupUsername.trim() === '' || signupEmail.trim() === '' || signupPassword.trim() === '') {
            console.log('empty username, email or password');
            status = 0; // status is 0 when empty input errors happen
            callback(status);
            return;
        }

        // Javascript Email validation regex 
        // eslint-disable-next-line no-control-regex
        var emailformat = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;

        if (!emailformat.test(signupEmail)) {
            console.log('invalid email format');
            status = 3; // invalid email format
            callback(status);
            return;
        }

        var query = {
            username: signupUsername
        };

        collection
            .find(query)
            .toArray(function (err, res) {
                if (err) 
                    throw err;
                
                if (res.length !== 0) { // checks if the username has been taken
                    console.log('the username has been taken, please choose another username');
                    status = 1; // status is 1 when having duplicate usernames
                    callback(status);
                    return;
                } else { // else, create the new user
                    var myobj = {
                        username: signupUsername,
                        password: signupPassword,
                        email: signupEmail,
                        wins: 0,
                        gamePlayed: 0
                    };

                    collection.insertOne(myobj) // is res actually needed?
                        .then(result => console.log(`Successfully inserted item with _id: ${result.insertedId}`))
                        .catch(err => console.error(`Failed to insert item: ${err}`));

                    return;
                }
            });
    };
});
