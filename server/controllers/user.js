var models = require('../models');
var formatErrors = require('../helpers/formatErrors');

exports.create = async function(req, res) {
  try {
    const user = await models.User.create(req.body);
    res.json({ok: true, user: user});
  } catch (error) {
    res.json({ok: false, errors: formatErrors(error, models)});
  }
};
