var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');
var multer = require('multer');
var upload = multer({dest: 'public/user_images/'});

router.post('/create', userController.create);

router.post('/login', userController.login);

router.post('/upload-image', upload.single('profile_pic'), userController.upload_image);

module.exports = router;
