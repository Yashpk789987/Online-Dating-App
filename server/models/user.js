const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      username: {
        type: DataTypes.STRING,
        validate: {
          isAlphanumeric: {
            args: true,
            msg: 'The Username can only contain letters and numbers',
          },
          len: {
            args: [3, 25],
            msg: 'The username needs to be between 3 and 25 characters long',
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: {
            args: true,
            msg: 'Invalid Email',
          },
        },
      },
      phone: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isInt: {
            msg: 'This Field Must be number ',
          },
          len: {
            args: [10, 10],
            msg: 'The phone number needs to be 10 characters long ',
          },
        },
      },
      dob: {
        type: DataTypes.DATEONLY,
        validate: {
          isDate: {
            args: true,
            msg: `Please Choose Date Of Birth`,
          },
          notEmpty: {
            args: true,
            msg: `Please Choose Date Of Birth `,
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [5, 100],
            msg: 'The password needs to be between 5 and 100 characters long ',
          },
        },
      },
    },
    {
      hooks: {
        afterValidate: async (user, options) => {
          user.password = await bcrypt.hash(user.password, 12);
        },
      },
    },
  );

  //   User.associate = models => {};

  return User;
};
