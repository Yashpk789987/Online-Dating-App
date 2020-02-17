// var express = require('express');

// var app = express();
// var path = require('path');
// ///////// VIEW ENGINE ///////////////
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
// //////// VIEW ENGINE ///////////////
// ////// STATIC ///////
// app.use(express.static(path.join(__dirname, 'public')));
// ////// STATIC ///////
// app.get('/', function(req, res) {
//   res.render('chat');
// });

// var server = require('http').createServer(app);
// var io = require('socket.io')(server);

// server.listen('3000', function() {
//   console.log(`Example app listening on port 3000!`);
// });

// let socketsArray = [];

// io.on('connection', socket => {
//   socketsArray.push(socket.id);
//   socket.broadcast.emit('add-users', {
//     users: [socket.id],
//   });

//   socket.on('disconnect', () => {
//     socketsArray.splice(socketsArray.indexOf(socket.id), 1);
//     io.emit('remove-user', socket.id);
//   });

//   //////////// OFFER LISTENER //////////////
//   socket.on('make-offer', function(data) {
//     socket.to(data.to).emit('offer-made', {
//       offer: data.offer,
//       socket: socket.id,
//     });
//   });

//   /////////// OFFER LISTENER //////////////
//   ////////// OFFER ANSWER LISTENER  LISTENER FROM OTHER CLIENT ///////
//   socket.on('make-answer', function(data) {
//     socket.to(data.to).emit('answer-made', {
//       socket: socket.id,
//       answer: data.answer,
//     });
//   });
//   ////////// OFFER ANSWER LISTENER  LISTENER FROM OTHER CLIENT ///////
// });

var express = require('express');

var app = express();
var path = require('path');
///////// VIEW ENGINE ///////////////
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//////// VIEW ENGINE ///////////////
////// STATIC ///////
app.use(express.static(path.join(__dirname, 'public')));
////// STATIC ///////
app.get('/', function(req, res) {
  res.render('chat');
});

app.get('/connect', function(req, res) {
  res.json({connected: 'true'});
});

var server = require('http').createServer(app);
var io = require('socket.io')(server);

server.listen(process.env.PORT || '3000', function() {
  console.log(`Example app listening on port 3000!`);
});

let socketsArray = [];

io.on('connection', socket => {
  let user = {
    user_id: socket.handshake.query['user_id'],
    username: socket.handshake.query['username'],
    socket_id: socket.id,
  };

  socket.emit('self-acknowledge', {
    users: socketsArray,
  });

  socketsArray.push(user);
  socket.broadcast.emit('add-users', {
    users: socketsArray,
  });

  socket.on('disconnect', () => {
    let index = socketsArray
      .map(function(d) {
        return d['socket_id'];
      })
      .indexOf(socket.id);
    socketsArray.splice(index, 1);
    io.emit('remove-user', {users: socketsArray});
    console.log('After Disconnect', socketsArray);
  });

  //////////// OFFER LISTENER //////////////
  socket.on('make-offer', function(data) {
    socket.to(data.to).emit('offer-made', {
      offer: data.offer,
      socket: socket.id,
    });
  });

  /////////// OFFER LISTENER //////////////
  ////////// OFFER ANSWER LISTENER  LISTENER FROM OTHER CLIENT ///////
  socket.on('make-answer', function(data) {
    console.log('make answer ');
    socket.to(data.to).emit('answer-made', {
      socket: socket.id,
      answer: data.answer,
    });
  });
  ////////// OFFER ANSWER LISTENER  LISTENER FROM OTHER CLIENT ///////
  /////////   FOR DISCONECTING CALL /////////////////
  socket.on('disconnect-call', function(data) {
    socket.to(data.to).emit('do-disconnect', {
      socket: socket.id,
    });
  });
  /////////   FOR DISCONECTING CALL /////////////////
});
