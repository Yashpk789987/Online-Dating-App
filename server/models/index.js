const Sequelize = require('sequelize');

const sequelize = new Sequelize('online-dating', 'root', '', {
  dialect: 'mysql',
  define: {
    underscored: true,
  },
});

const models = {
  User: sequelize.import('./user'),
  Photo: sequelize.import('./photo'),
};

Object.keys(models).forEach(modelName => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
