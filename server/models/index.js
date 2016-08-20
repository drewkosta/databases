var db = require('../db');
var request = require('request');

var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

request({
  method: 'POST',
  uri: 'http://127.0.0.1:3000/classes/messages',
  json: {
    username: 'Valjean',
    text: 'In mercy\'s name, three days is all I need.',
    roomname: 'Hello'
  }
}, function (err, data) {
});

module.exports = {
  messages: {
    get: function (req, res) {
      var queryString = 'SELECT u.name as username, r.name as roomname, m.text, m.id as objectId, m.createdAt FROM users u, rooms r, messages m where u.id = m.user_id and r.id = m.room_id';
      db.query(queryString, [], function(err, data) {
        if (err) {
          res.writeHead(404, headers);
          res.end(err);
        } else {
          res.writeHead(200, headers);
          res.end(JSON.stringify(data));
        }
      });
    },
    post: function (req, res) {
      var message = '';
      var messageObj = req.body;

      req.on('data', function(chunk) {
        message += chunk;
        messageObj = JSON.parse(message);
      });

      var queryForUserId = 'SELECT u.id as user_id FROM users u WHERE u.name = "' + messageObj.username + '";';

      var queryForRoomId = 'SELECT r.id as room_id FROM rooms r WHERE r.name = "' + messageObj.roomname + '";';

      var queryAddUsers = 'INSERT INTO users (name) values ("' + messageObj.username + '");';

      var queryAddRooms = 'INSERT INTO rooms (name) values ("' + messageObj.roomname + '");';
      var queryInsertMessageString = 'INSERT INTO messages (user_id, room_id, text) values ((SELECT id from users where name = "' + messageObj.username + '"), (SELECT id from rooms where name = "' + messageObj.roomname + '"), "' + messageObj.text + '")';
      
      var insertMessage = function(res) {
        return db.query(queryInsertMessageString, function(err, data) {
          if (err) {
          } else {
            res.writeHead(201, headers);
            res.end('done!');
          }
        });
      };

      var insertNewMessage = function() {
        db.query(queryForUserId, [], function(err, data) {
          if (err) {
          } else {
            if (data.length === 0) {
              db.query(queryAddUsers, [], function(err, data) {
                insertMessage(res);
              });
            } else {
              db.query(queryForRoomId, [], function(err, data) {
                if (err) {
                } else {
                  if (data.length === 0) {
                    db.query(queryAddRooms, [], function(err, data) {
                      insertMessage(res);
                    });
                  } else {
                    insertMessage(res);
                  }
                }
              });
            }
          }
        });
      };

      req.on('end', function() {
        insertNewMessage();
      });

      insertNewMessage();
    },

    users: {
      get: function (req, res) {
        var queryString = 'SELECT * FROM users';
        db.query(queryString, [], function(err, data) {
          if (err) {
            res.end(err);
          } else {
            res.end(data);
          }
        });
      },
      post: function (req, res) {
        var user = '';
        var userObj = user;
        var queryAddUserString = 'INSERT INTO users (name) values ("' + req.body.username + '");';
        db.query(queryAddUserString, [], function (err, data) {
          res.end();
        });
      }
    }
  }
};