const Sequelize = require('sequelize');

// const sequelize = new Sequelize('saanviin_dating', 'saanviin_dating', 'Reactnative@2018', {
//   host: '68.66.224.58',
//   dialect: 'mysql',
//   define: {
//     underscored: true,
//   },
// });

const sequelize = new Sequelize('online-dating', 'root', '', {
  dialect: 'mysql',
  define: {
    underscored: true,
  },
});

const models = {
  User: sequelize.import('./user'),
  Photo: sequelize.import('./photo'),
  Like: sequelize.import('./like'),
};

Object.keys(models).forEach(modelName => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
