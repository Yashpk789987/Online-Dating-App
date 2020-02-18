var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');

router.post('/create', userController.create);

module.exports = router;
