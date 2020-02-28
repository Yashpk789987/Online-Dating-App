var models = require('../models');

exports.create = async function(data) {
  try {
    let result = await models.Message.create(data);
    return {ok: true};
  } catch (error) {
    console.log(error);
    return {ok: false, error};
  }
};

exports.findAllBySenderAndReceiverId = async function(req, res) {
  try {
    let {sender_id, receiver_id} = req.params;
    let messages = await models.Message.findAll(
      {
        where: {
          $or: [
            {sender: sender_id, receiver: receiver_id},
            {sender: receiver_id, receiver: sender_id},
          ],
        },
        order: [['id', 'DESC']],
      },
      {raw: true},
    );
    res.json({ok: true, messages: messages});
  } catch (error) {
    console.log(error);
  }
};
