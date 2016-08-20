var db = require('../db');
// var app = require('../app');
// var bodyParser = require('body-parser');
// // app.app.use(bodyParser.json());
// console.log('app', app)


var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};


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
      // console.log('req',req)
      req.on('data', function(chunk) {
        // console.log('chunk', JSON.parse(chunk));
        message += chunk;
      });
      req.on('end', function() {
        // console.log(req.params)
        var messageObj = JSON.parse(message);
        console.log(messageObj);
        //roomname, username, text
        
        //username=anonymous&text=daddad&roomname=lobby
        // var queryForUsers = 'SELECT * FROM rooms';
        // db.query(queryForUsers, [], function(err, data) {
        //   console.log('got user table!', data);
        // });
        console.log(messageObj.username, messageObj.roomname);

        var queryForIds = 'SELECT r.id as room_id, u.id as user_id FROM rooms r, users u WHERE u.name = "' + messageObj.username + '" and r.name = "' + messageObj.roomname + '";';
        db.query(queryForIds, [], function(err, data) {
          if (err) {
            console.log(err);
          } else {
            console.log('got ids!', data);
          }
        });

        // var parsedMessage = JSON.parse(message);
        // console.log('parsedmessage', parsedMessage);

      });
      
      // var queryForIds = 'SELECT r.id, u.id FROM rooms r, users u, messages m WHERE m.username = ' + parsedMessage
      // var queryString = 'INSERT INTO messages (text, user_id, room_id) values ((';



      // db.query(queryString, [], function(err, data) {
      //   console.log('data', data);
      //   if (err) {
      //     res.writeHead(404, headers);
      //     res.end(err);
      //   } else {
      //     console.log(data);
      //     res.writeHead(200, headers);
      //     res.end(JSON.stringify(data));
      //   }
      // });

      // res.writeHead(201, headers);
      // res.end();


    }
  },

  users: {
    get: function (req, res) {
      var queryString = 'SELECT * FROM users';
      db.query(queryString, [], function(err, data) {
        console.log('data', data);
        if (err) {
          res.end(err);
        } else {
          console.log(data);
          res.end(data);
        }
      });
    },
    post: function (req, res) {
    
    }
  }
};

// module.exports.messages.get();

// var tablename = 'messages'; // TODO: fill this out

//     dbConnection.query('truncate ' + tablename, done);

    // dbConnection.query(queryString, queryArgs, function(err) {
    //   if (err) { throw err; }

    //   // Now query the Node chat server and see if it returns
    //   // the message we just inserted:
    //   request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
    //     var messageLog = JSON.parse(body);
    //     expect(messageLog[0].text).to.equal('Men like you can never change!');
    //     expect(messageLog[0].roomname).to.equal('main');
    //     done();
    //   });
    // });