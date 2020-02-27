var express = require('express');
var router = express.Router();
var likeController = require('../controllers/like');

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

router.post('/create', likeController.create);

router.post('/update-like-status', likeController.updateLikeStatus);

router.get('/find-by-profileId/:profileId', likeController.findByProfileId);

router.get('/find-info-by-profileId/:profileId', likeController.findInfoByProfileId);

router.get('/load-matches-by-profileId/:profileId', likeController.loadMatchesForProfile);

module.exports = router;
