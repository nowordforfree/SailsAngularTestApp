/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	index: function (req, res) {
		return res.json({
			message: 'Here will be view soon... Maybe...'
		})
	},

  /**
   * `UserController.create()`
   */
  create: function (req, res) {
    if (req.method !== 'POST') {
      return res.json(405, { error: 'Only POST method allowed for this request' });
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.json(401, {error: 'Password doesn\'t match'});
    }
    Users.create(req.body).exec(function (err, user) {
      if (err) {
        return res.json(err.status, {error: err});
      }
      if (user) {
        res.json(200, {
          user: user,
          token: AuthService.issueToken(user.id)
        });
      }
    });
  },


  /**
   * `UserController.get()`
   */
  get: function (req, res) {
    return res.json({
      todo: 'get() is not implemented yet!'
    });
  },


  /**
   * `UserController.update()`
   */
  update: function (req, res) {
		if (!req.params.id) {
			return res.json({
				error: 'User Id is not in request body'
			});
		}
		User.update({ id: req.params.id }, req.body)
				.exec(function (err, updated) {
					if (err) {
						return res.json(err.status, { error: err });
					}
					res.json(200, {
						message: updated
					});
				});
  },


  /**
   * `UserController.delete()`
   */
  delete: function (req, res) {
		if (!req.params.id) {
			return res.json({
				error: 'User Id is missing'
			});
		}
    User.destroy({
			id: req.params.id
		}).exec(function (err) {
			if (err) {
				res.negotiate(err);
			}
			res.ok();
		});
  }
};
