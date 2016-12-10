/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var bcrypt = require('bcrypt');

module.exports = {
  attributes: {
    id: {
      type: 'string',
      unique: true,
      primaryKey: true
    },
    firstname : { type: 'string' },
    lastname : { type: 'string' },
    email : { type: 'email', required: true, unique: true },
    password : { type: 'string', required: true },
    getFullName: function () {
      return this.firstname + ' ' + this.lastname;
    }
  },
  beforeCreate: function(values, next) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(values.password, salt, function (err, hash) {
        if (err) {
          return next(err);
        }
        values.password = hash;
        next();
      })
    })
  },
  comparePassword : function (password, user, cb) {
    bcrypt.compare(password, user.password, function (err, match) {
      if (err) {
        cb(err);
      }
      if(match) {
        cb(null, true);
      } else {
        cb(err);
      }
    });
  }
};
