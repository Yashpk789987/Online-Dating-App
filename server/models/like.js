module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    'like',
    {
      likeBack: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'profile_id'],
        },
      ],
    },
  );

  Like.associate = models => {
    Like.belongsTo(models.User, {
      foreignKey: {
        name: 'profileId',
        field: 'profile_id',
      },
    });
    Like.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        field: 'user_id',
      },
    });
  };

  return Like;
};
