var models = require('../models');

exports.create = async function(req, res) {
  try {
    let like = await models.Like.create(req.body);
    res.json({ok: true, like});
  } catch (error) {
    res.json({ok: false, like: {}, error});
  }
};
