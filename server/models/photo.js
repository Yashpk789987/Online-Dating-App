module.exports = (sequelize, DataTypes) => {
  const Photo = sequelize.define('photo', {
    name: {
      type: DataTypes.STRING,
    },
    is_profile: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  Photo.associate = models => {
    Photo.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        field: 'user_id',
      },
    });
  };

  return Photo;
};
