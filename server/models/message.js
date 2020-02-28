module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    'message',
    {
      message: {
        type: DataTypes.STRING(2048),
      },
    },
    {charset: 'utf8mb4', collation: 'utf8mb4_general_ci'},
  );
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
