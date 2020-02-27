var jwt = require('jsonwebtoken');
var express = require('express');
var cookieParser = require('cookie-parser');

var models = require('./models');
var app = express();
var path = require('path');

//////// IMPORTING ROUTES ///////////

var userRouter = require('./routes/user');
var likeRouter = require('./routes/like');
//////// IMPORTING ROUTES ///////////

///////// VIEW ENGINE ///////////////
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//////// VIEW ENGINE ///////////////

////// STATIC ///////
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
////// STATIC ///////

/////// USING ROUTES /////
app.use('/user', userRouter);
app.use('/like', likeRouter);
/////// USING ROUTES /////

app.get('/', function(req, res) {
  res.render('chat');
});

app.get('/connect', function(req, res) {
  res.json({connected: 'true'});
});

var server = require('http').createServer(app);
var io = require('socket.io')(server);

models.sequelize.sync().then(() => {
  console.log('Database Synced');
});

server.listen(process.env.PORT || '3000', function() {
  console.log(`Example app listening on port 3000!`);
});

let socketsArray = [];

io.on('connection', socket => {
  let info = JSON.parse(socket.handshake.query['user']);
  let user = {
    user_id: socket.handshake.query['user_id'],
    username: socket.handshake.query['username'],
    socket_id: socket.id,
    info,
  };

  console.log(user);

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

  ////// FOR REAL TIME CHAT MESSAGING ///////////////
  socket.on('send-chat-message', function(data) {
    socket.to(data.user.socket_id).emit('receive-message', {
      socket: socket.id,
      message: data.message,
    });
  });
  ////// FOR REAL TIME CHAT MESSAGING ///////////////
});

// var fs = require('fs');
// var filePath = __dirname + '/public/user_images/1055cf79d446364be4c6cec8c6eb3790';
// fs.unlinkSync(filePath);
