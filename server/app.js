var jwt = require('jsonwebtoken');
var express = require('express');
var cookieParser = require('cookie-parser');

var models = require('./models');
var messageController = require('./controllers/message');
var userController = require('./controllers/message');
var app = express();
var path = require('path');
var FCM = require('fcm-node');
var serverKey =
  'AAAAWnLW7AM:APA91bEFnJ2MpEOnJIu8zCAO2jjwxu_wAs5YJ-4ZxRP4t7YL2e01FUlfkEMI1iN96bdowOEIqo126_e8DYIJxLOjwIW7dP9PcyYMUeqktOyG02joxvd-2atB090koJQ11f9n04HpUQF-';
var fcm = new FCM(serverKey);

////    PUSH NOTIFICATION /////////

async function notify(token) {
  var message = {
    to:
      'fVUcmdqrCfQ:APA91bH6IzLT0Lt3gW9XUl_GgWB68vyS9wi6vt-ZCfZozpSTBccXLkMPvUrCFzXZU_NpRySkHmNNyQGAAjWtTBb8rwIFkH4d7gVQSoHlyS4KWHHx5y3sa9VTjw0mGEEKoENeoTXtlApt',
    notification: {
      title: 'Title of your push notification',
      body: 'Body of your push notification',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3MiAmA8IvIhKxDnFCTgzjGcutJDkx0SsP-1gJ6mgdL4_KJ01ayg&s',
    },

    data: {
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3MiAmA8IvIhKxDnFCTgzjGcutJDkx0SsP-1gJ6mgdL4_KJ01ayg&s',
      my_key: 'my value',
      my_another_key: 'my another value',
    },
  };
  try {
    let response = await fcm.send(message);
    console.log(response);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function findToken(receiverId) {
  let result = await userController.findTokenByUserId(receiverId);
  if (result.ok) {
    return result.token;
  } else {
    return null;
  }
}

///// PUSH NOTIFICATION /////////

//////// SAVING MESSAGE  ASYNC ////////

async function saveMessage(data) {
  let dbData = {message: JSON.stringify(data.message), sender: data.sender_id, receiver: data.receiver_id};
  let result = messageController.create(dbData);
  if (!result.ok) {
    console.log('ERROR INSIDE saveMessage', result.error);
  }
}

/////// SAVING MESSAGE ASYNC ////////

//////// IMPORTING ROUTES ///////////

var userRouter = require('./routes/user');
var likeRouter = require('./routes/like');
var messageRouter = require('./routes/message');

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
app.use('/message', messageRouter);
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

function findChatRoom(room_name) {
  let find1 = io.sockets.adapter.rooms[room_name];
  let find2 =
    io.sockets.adapter.rooms[
      room_name
        .split('')
        .reverse()
        .join('')
    ];

  if (find1 === undefined && find2 === undefined) {
    return {ok: false};
  } else {
    let return_room_name =
      find1 === undefined
        ? room_name
            .split('')
            .reverse()
            .join('')
        : room_name;
    return {ok: true, room: return_room_name, room_object: find1 || find2};
  }
}

let socketsArray = [];

io.on('connection', socket => {
  let info = JSON.parse(socket.handshake.query['user']);
  let user = {
    user_id: socket.handshake.query['user_id'],
    username: socket.handshake.query['username'],
    socket_id: socket.id,
    info,
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

  ////// FOR REAL TIME CHAT MESSAGING ///////////////
  socket.on('send-chat-message', function(data) {
    saveMessage(data);
    let result = findChatRoom(data.room_name);
    if (result.ok) {
      socket.to(result.room).emit('receive-message', {
        message: data.message,
      });
    }
  });
  ////// FOR REAL TIME CHAT MESSAGING ///////////////

  //// FOR JOINING AND LEAVING ROOM //////////
  socket.on('join-room', function(data) {
    let result = findChatRoom(data.room_name);
    if (result.ok) {
      socket.join(result.room);
    } else {
      socket.join(data.room_name);
    }
    console.log('all rooms', io.sockets.adapter.rooms);
  });
  socket.on('leave-room', function(data) {
    let result = findChatRoom(data.room_name);

    if (result.ok) {
      socket.leave(result.room);
    }
    console.log('all rooms', io.sockets.adapter.rooms);
  });
  //// FOR JOINING AND LEAVING ROOM //////////
});

// var fs = require('fs');
// var filePath = __dirname + '/public/user_images/1055cf79d446364be4c6cec8c6eb3790';
// fs.unlinkSync(filePath);

// socket.on('send-chat-message', function(data) {
//     saveMessage(data);
//     socket.to(data.user.socket_id).emit('receive-message', {
//       socket: socket.id,
//       message: data.message,
//     });
//   });
