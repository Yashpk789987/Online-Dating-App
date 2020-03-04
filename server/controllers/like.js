var models = require('../models');

exports.create = async function(req, res) {
  try {
    let like = await models.Like.create(req.body);
    res.json({ok: true, like});
  } catch (error) {
    res.json({ok: false, like: {}, error});
  }
};

exports.findByProfileId = async function(req, res) {
  try {
    let profileId = req.params.profileId;
    let likes = await models.Like.findAll({where: {profile_id: profileId}}, {raw: true});
    res.json({ok: true, likes});
  } catch (error) {
    res.json({ok: false, likes: [], error});
  }
};

exports.findInfoByProfileId = async function(req, res) {
  try {
    let profileId = req.params.profileId;
    let query = `SELECT l.id as like_id , l.like_back , l.dislike_back , p.username AS username, p.id AS profile_id, p.profile_pic AS profile_pic FROM likes AS l, users AS p WHERE l.user_id = p.id AND l.profile_id  = ${profileId} AND l.like_back = 0 AND l.dislike_back = 0`;
    let likes = await models.sequelize.query(query, {
      replacements: [profileId],
      type: models.sequelize.QueryTypes.SELECT,
    });
    res.json({ok: true, likes});
  } catch (error) {
    res.json({ok: false, likes: [], error});
  }
};

exports.loadMatchesForProfile = async function(req, res) {
  try {
    let profileId = req.params.profileId;
    let query = `SELECT l.id as like_id , l.like_back , l.dislike_back , p.username AS username, p.id AS profile_id, p.profile_pic AS profile_pic , p.token FROM likes AS l, users AS p WHERE l.profile_id = p.id AND l.user_id  = ${profileId}  AND l.like_back = 1 AND l.dislike_back = 0`;

    let matches = await models.sequelize.query(query, {
      replacements: [profileId],
      type: models.sequelize.QueryTypes.SELECT,
    });

    res.json({ok: true, matches});
  } catch (error) {
    res.json({ok: false, error, matches: []});
  }
};

exports.updateLikeStatus = async function(req, res) {
  try {
    if (req.body.like_back === true) {
      let {like_back, user_id, profile_id, id} = req.body;
      let like = await models.Like.update({like_back: like_back}, {where: {id: id}, returning: true, plain: true});
      await models.Like.create({like_back: like_back, userId: `${user_id}`, profileId: `${profile_id}`});
    } else {
      let {dislike_back, id} = req.body;
      await models.Like.update({dislike_back: dislike_back}, {where: {id: id}});
    }
    res.json({ok: true});
  } catch (error) {
    res.json({ok: false, error});
  }
};
