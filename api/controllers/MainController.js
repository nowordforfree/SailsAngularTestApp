/**
 * UserController
 *
 * @description :: Server-side logic for main page
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    index: function (req, res) {
		return res.view('main');
	}
};
