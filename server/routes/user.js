var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');
var multer = require('multer');
var upload = multer({dest: 'public/user_images/'});
var jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

///// FOR GIFS ////////

router.get('/gifs/:query', async function(req, res) {
  let query = req.params.query;
  let response = await fetch(
    `http://api.giphy.com/v1/gifs/search?q=${query}&api_key=2VHjBw7fIprfJDcVUNgRtPHfNurEw6nB&limit=20`,
  );
  let data = await response.json();
  res.json({ok: true, data: data});
});

//// FOR GIFS /////////

router.post('/create', userController.create);

router.post('/login', userController.login);

router.post('/upload-image', upload.single('pic'), userController.upload_image);

router.get('/all-images/:userId', userController.getImages);

router.post('/demo', function(req, res) {
  console.log('data', req.body);
  res.json({ok: true});
});

router.all('/*', async function(req, res, next) {
  try {
    let token = req.headers.auth;
    var decoded = await jwt.verify(token, 'Reactnative@2018');
    next();
  } catch (err) {
    res.json({ok: false, msg: 'Authentication Failed', code: 'auth_failed'});
  }
});

router.get('/all-users-except-self/:userId', userController.allUsersExceptSelf);

router.get('/user-by-id/:userId', userController.findById);

router.get('/photos/:userId', userController.allPhotos);

router.post('/update-token', userController.updateToken);

router.get('/getUsersByPattern/:searchPattern', userController.findUsersBySearchPattern);

router.post('/logout', userController.logout);

module.exports = router;
