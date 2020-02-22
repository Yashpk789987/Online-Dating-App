var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');
var multer = require('multer');
var upload = multer({dest: 'public/user_images/'});
var jwt = require('jsonwebtoken');

router.post('/create', userController.create);

router.post('/login', userController.login);

// router.all('/*', function(req, res, next) {
//   try {
//     let token = req.headers.auth;
//     console.log(token);
//     var decoded = jwt.verify(token, 'Reactnative@2018');
//     next();
//   } catch (err) {
//     res.json({ok: false, msg: 'Authentication Failed', code: 'auth_failed'});
//   }
// });

router.post('/upload-image', upload.single('pic'), userController.upload_image);

router.get('/all-images/:userId', userController.getImages);

module.exports = router;
