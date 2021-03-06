/**
 * User.js
 *
 * @description :: User model
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var bcrypt = require('bcrypt');

module.exports = {
  attributes: {
    avatar: { type: 'string' },
    firstname : { type: 'string' },
    lastname : { type: 'string' },
    email : { type: 'email', required: true, unique: true },
    password : { type: 'string', required: true, minLength: 6 },
    getFullName: function () {
      return (this.firstname && this.lastname) ?
              this.firstname + ' ' + this.lastname :
              this.email;
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
