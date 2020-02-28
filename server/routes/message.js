var express = require('express');
var router = express.Router();
var messageController = require('../controllers/message');

var jwt = require('jsonwebtoken');

router.all('/*', async function(req, res, next) {
  try {
    let token = req.headers.auth;
    var decoded = await jwt.verify(token, 'Reactnative@2018');
    next();
  } catch (err) {
    console.log(err);
    res.json({ok: false, msg: 'Authentication Failed', code: 'auth_failed'});
  }
});

router.get('/get-all-messages/:sender_id/:receiver_id', messageController.findAllBySenderAndReceiverId);

module.exports = router;
