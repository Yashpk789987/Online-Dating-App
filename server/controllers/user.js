var models = require('../models');
var formatErrors = require('../helpers/formatErrors');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.create = async function(req, res) {
  try {
    const user = await models.User.create({
      ...req.body,
      location: {type: 'Point', coordinates: [req.body.latitude, req.body.longitude]},
    });
    var token = await jwt.sign(user.dataValues, 'Reactnative@2018', {expiresIn: '30d'});
    res.json({ok: true, token: token});
  } catch (error) {
    res.json({ok: false, errors: formatErrors(error, models)});
  }
};

exports.login = async function(req, res) {
  try {
    const {email_mobile_username, password} = req.body;
    const user = await models.User.findOne({
      where: {$or: [{username: email_mobile_username}, {phone: email_mobile_username}, {email: email_mobile_username}]},
    });
    if (user == null) {
      res.json({ok: false, error: {path: 'user', msg: 'User Do Not Exist'}});
    } else {
      if (bcrypt.compareSync(password, user.password)) {
        const user = await models.User.create(req.body);
        var token = await jwt.sign(user.dataValues, 'Reactnative@2018', {expiresIn: '30d'});
        res.json({ok: true, token: token});
      } else {
        res.json({ok: false, error: {path: 'password', msg: 'Wrong Password'}});
      }
    }
  } catch (error) {
    console.log(error);
    res.json({ok: false, error: {path: 'unknown', msg: 'There Is Some Techincal Issue'}});
  }
};
