/**
 * ReceiverController
 *
 * @description :: Server-side logic for managing receivers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	index: function (req, res) {
		Receiver.find().exec(function (err, receivers) {
			if (err) {
				return res.negotiate(err);
			}
			res.json({ data: receivers });
		});
	},

  /**
   * `ReceiverController.create()`
   */
  create: function (req, res) {
    if (req.method !== 'POST') {
      return res.json(405, { error: 'Only POST method allowed for this request' });
    }

    if (!req.body.type) {
      return res.json(401, {error: 'Type is missing'});
    }
    if (!req.body.key) {
      return res.json(401, {error: 'Key (id) is missing'});
    }

		Receiver
      .create(req.body)
      .exec(function (err, receiver) {
				if (err) {
					res.negotiate(err);
				}
				res.json({ data: receiver });
			});
  },


  /**
   * `ReceiverController.get()`
   */
  get: function (req, res) {
		if (!req.params.id) {
			return res.json({
				error: 'Receiver Id is not in request body'
			});
		}
		Receiver
			.findOneById(req.params.id)
			.exec(function (err, receiver) {
				if (err) {
					return res.negotiate(err);
				}
				res.json({ data: receiver });
			})
  },


  /**
   * `ReceiverController.update()`
   */
  update: function (req, res) {
		if (!req.params.id) {
			return res.json({
				error: 'Receiver Id is not in request body'
			});
		}
		Receiver
      .update(
        { id: req.params.id },
        req.body
      ).exec(function (err, updated) {
        if (err) {
          return res.negotiate(err);
        }
        res.json({ data: updated });
      });
  },


  /**
   * `ReceiverController.delete()`
   */
  delete: function (req, res) {
		if (!req.params.id) {
			return res.json({
				error: 'Receiver Id is missing'
			});
		}
    Receiver.destroy({
			id: req.params.id
		}).exec(function (err) {
			if (err) {
				res.negotiate(err);
			}
			res.ok();
		});
  }
};
