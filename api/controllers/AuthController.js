/**
 * AuthController
 *
 * @description :: Server-side logic for managing Authcontrollers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  /**
   * `AuthController.login()`
   */
  login: function (req, res) {
    var email = req.param('email');
    var password = req.param('password');
    
    if (!email || !password) {
      return res.json(401, {err: 'email and password required'});
    }
    
    User.findOneByEmail(email, function(err, user) {
      if (!user) {
        return res.json(401, {err: 'user with such email not found'});
      }
      
      User.comparePassword(password, user, function(err, valid) {
        if (err) {
          return res.json(403, {err: 'forbidden'});
        }
        
        if (!valid) {
          return res.json(401, {err: 'invalid password'});
        } else {
          res.json({
            user: user,
            token: AuthService.issueToken(user._id)
          });
        }
      });
    });
  },
  /**
   * `AuthController.register()`
   */
  register: function (req, res) {
    if (req.method !== 'POST') {
      return res.json(405, { error: 'Only POST method allowed for this request' });
    }

    var email = req.body.email;
    var password = req.body.confirmPassword;
    var confirmPassword = req.body.confirmPassword;

    if (!email || !password || !confirmPassword) {
      return res.json(401, {error: 'email and password required'});
    }
    
    if (password !== confirmPassword) {
      return res.json(401, {error: 'Password doesn\'t match'});
    }

    User.create({
      email: email,
      password: password
    }).exec(function (err, user) {
      if (err) {
        return res.json(err.status, {err: err});
      }

      if (user) {
        res.ok({ user: user, token: AuthService.issueToken(user.id) });
      }
    });
  }
};

