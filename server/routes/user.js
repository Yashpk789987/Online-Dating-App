var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');
var multer = require('multer');
var upload = multer({dest: 'public/user_images/'});
var jwt = require('jsonwebtoken');

router.post('/create', userController.create);

router.post('/login', userController.login);

router.post('/upload-image', upload.single('pic'), userController.upload_image);

router.get('/all-images/:userId', userController.getImages);

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

router.get('/all-users-except-self/:userId', userController.allUsersExceptSelf);

router.get('/photos/:userId', userController.allPhotos);

module.exports = router;
