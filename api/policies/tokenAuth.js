/**
 * tokenAuth
 *
 * @module      :: Policy
 * @description :: Policy to restrict unauthenticated access
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {
  var token;
  console.log('tokenAuth policy called');
  if (req.headers && req.headers.authorization) {
    var parts = req.headers.authorization.split(' ');
    if (parts.length === 2) {
      var scheme      = parts[0],
          credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    } else {
      return res.json(401, {error: 'Format is Authorization: Bearer [token]'});
    }
  } else if (req.param('token')) {
    token = req.param('token');
    // We delete the token from param to not mess with blueprints
    delete req.query.token;
  } else {
    return res.json(401, {error: 'No Authorization header was found'});
  }

  AuthService.verifyToken(token, function(err, token) {
    if (err) {
      return res.json(401, {error: 'The token is not valid'});
    }

    req.token = token;

    return next();
  });
};
