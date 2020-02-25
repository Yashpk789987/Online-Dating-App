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

exports.upload_image = async function(req, res) {
  try {
    let photo = await models.Photo.create({...req.body, name: req.file.filename});
    if (req.body.is_profile == 'true') {
      await models.Photo.update({is_profile: false}, {where: {id: {$not: photo.id}, user_id: req.body.userId}});
      await models.sequelize.query(
        `update users set profile_pic = '${req.file.filename}' where id = ${parseInt(req.body.userId)}`,
      );
    }
    res.json({ok: true, photo});
  } catch (error) {
    res.json({ok: false, error});
  }
};

exports.getImages = async function(req, res) {
  try {
    let userId = req.params.userId;
    let photos = await models.Photo.findAll({where: {user_id: userId}}, {raw: true});
    res.json({ok: true, photos});
  } catch (error) {
    console.log(error);
    res.json({ok: false, error});
  }
};

exports.allUsersExceptSelf = async function(req, res) {
  try {
    let userId = req.params.userId;
    let users = await models.User.findAll({where: {id: {$not: userId}}});
    res.json({ok: true, users});
  } catch (error) {
    res.json({ok: false, users: [], error});
  }
};

exports.findById = async function(req, res) {
  try {
    let userId = req.params.userId;
    let user = await models.User.findById(userId);
    let photos = await models.Photo.findAll({where: {user_id: userId}});
    res.json({ok: true, user, photos});
  } catch (error) {
    res.json({ok: false, user: {}, photos: [], error});
  }
};

exports.allPhotos = async function(req, res) {
  try {
    let userId = req.params.userId;
    let photos = await models.Photo.findAll({where: {user_id: userId}});
    res.json({ok: true, photos});
  } catch (error) {
    res.json({ok: false, photos: [], error});
  }
};
