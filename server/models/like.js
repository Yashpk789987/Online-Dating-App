module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    'like',
    {
      like_back: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      dislike_back: {
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
