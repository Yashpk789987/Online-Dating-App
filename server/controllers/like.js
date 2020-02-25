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
