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
            msg: 'This Field Must be number',
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
      about: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [20, 100],
            msg: 'Your Description needs to be between 20 and 100 characters lonng',
          },
        },
      },
      profile_pic: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.GEOMETRY('POINT'),
        notEmpty: {
          args: true,
          msg: `Location Cannot be null`,
        },
      },
      token: {
        type: DataTypes.STRING,
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
  return User;
};
