module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('message', {
    message: {
      type: DataTypes.STRING,
    },
  });
  Message.associate = models => {
    Message.belongsTo(models.User, {
      foreignKey: {
        name: 'sender',
        field: 'sender_id',
      },
    });
    Message.belongsTo(models.User, {
      foreignKey: {
        name: 'receiver',
        field: 'receiver_id',
      },
    });
  };
  return Message;
};
