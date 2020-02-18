module.exports = (sequelize, DataTypes) => {
  const Photo = sequelize.define('photo', {
    name: {
      type: DataTypes.STRING,
      validate: {
        nonEmpty: {
          args: true,
          msg: 'The Image Cannot be empty',
        },
      },
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
