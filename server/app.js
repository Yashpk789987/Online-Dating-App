var jwt = require('jsonwebtoken');
var express = require('express');
var cookieParser = require('cookie-parser');

var models = require('./models');
var messageController = require('./controllers/message');
var userController = require('./controllers/message');
var app = express();
var path = require('path');
var serviceAccount = require('./public/firebase-admin.json');
var admin = require('firebase-admin');
var baseurl = 'https://video-chat-pk2128.herokuapp.com';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://online-dating-f7326.firebaseio.com',
});

async function notify(token, sender_name, sender_image, message, object) {
  var message = {
    token: token,
    notification: {
      title: sender_name,
      body: message,
    },
    android: {
      ttl: 0,
      priority: 'high',
      notification: {
        notification_priority: 'PRIORITY_MAX',
        sound: 'default',
        image: `${baseurl}/user_images/${sender_image}`,
        icon: `${baseurl}/user_images/${sender_image}`,
        local_only: true,
        default_vibrate_timings: true,
        channel_id: 'test-channel',
      },
    },
    data: {
      user: JSON.stringify(object),
    },
  };

  try {
    let response = await admin.messaging().send(message);
    console.log('response ::', response);
    return true;
  } catch (error) {
    console.log('notify ::', error);
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
    //console.log('ERROR INSIDE saveMessage', result.error);
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

app.get('/push', async function(req, res) {
  let result = await notify();
  res.json({code: result});
});

app.get('/connect', async function(req, res) {
  let users = await models.User.findAll();
  res.json({connected: 'true', users: users});
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
  let find2 = io.sockets.adapter.rooms[room_name.split('-')[1] + '-' + room_name.split('-')[0]];

  if (find1 === undefined && find2 === undefined) {
    return {ok: false};
  } else {
    let return_room_name = find1 === undefined ? room_name.split('-')[1] + '-' + room_name.split('-')[0] : room_name;
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

  console.log(socketsArray);

  socket.on('disconnect', () => {
    let index = socketsArray
      .map(function(d) {
        return d['socket_id'];
      })
      .indexOf(socket.id);
    socketsArray.splice(index, 1);
    io.emit('remove-user', {users: socketsArray});
    //console.log('After Disconnect', socketsArray);
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
    //console.log('make answer ');
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
  /////////   FOR  CALL  REQUEST  ///////////////////
  socket.on('call-request', function(data) {
    console.log('call-request', data);
    socket.to(data.to).emit('on-call-request', {
      socket: socket.id,
      info: data.info,
    });
  });
  socket.on('acknowledge-call', function(data) {
    console.log('acknowledge-call', data);
    socket.to(data.to).emit('on-acknowledge-call', {
      socket: socket.id,
      code: data.code,
    });
  });
  /////////   FOR  CALL  REQUEST  ///////////////////
  ////// FOR REAL TIME CHAT MESSAGING ///////////////
  socket.on('send-chat-message', async function(data) {
    saveMessage(data);
    let result = findChatRoom(data.room_name);
    if (io.sockets.adapter.rooms[result.room].length === 1) {
      await notify(data.user.token, data.sender.username, data.sender.profile_pic, data.message.text, data.sender);
    }
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
    ////console.log('all rooms', io.sockets.adapter.rooms);
  });
  socket.on('leave-room', function(data) {
    let result = findChatRoom(data.room_name);

    if (result.ok) {
      socket.leave(result.room);
    }
    ////console.log('all rooms', io.sockets.adapter.rooms);
  });
  //// FOR JOINING AND LEAVING ROOM //////////
});
