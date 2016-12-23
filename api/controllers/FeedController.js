/**
 * FeedController
 *
 * @description :: Server-side logic for managing Feeds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	index: function (req, res) {
    User
      .findOneById(req.headers.user)
      .populate('subscribedTo')
      .exec(function (err, user) {
        if (err) {
          return res.negotiate(err);
        }
        if (user) {
          var subscribedIds = user.subscribedTo.map(function (model) {
            return model.id;
          });
          Feed
            .find()
						.populate('receivers')
            .exec(function (err, feeds) {
              if (err) {
                return res.negotiate(err);
              }
							var userFeeds = feeds.filter(function (feed) {
								return feed.receivers.some(function (obj) {
									return subscribedIds.indexOf(obj.id) > -1;
								});
							});
              if (req.isSocket) {
                user.subscribedTo.forEach(function (obj) {
                  if (obj.type !== 'all') {
                    sails.sockets.join(req, obj.name);
                  }
                });
                sails.sockets.join(req, 'all');
              }
              res.json({ data: userFeeds });
            });
  			} else {
  				res.json({ error: 'User not found' });
  			}
      });
	},

  create: function (req, res) {
    if (req.method !== 'POST') {
      return res.json(405, { error: 'Only POST method allowed for this request' });
    }

    if (!req.body.text) {
      return res.json(401, {error: 'Creating Feed without text not allowed'});
    }

    if (!req.body.receivers || !req.body.receivers.length) {
      return res.json(401, {error: 'Creating Feed without text not allowed'});
		}

    var ids = req.body.receivers.map(function(obj) {
      return obj.key;
    });

    Receiver
      .findById(ids)
      .exec(function (err, receivers) {
  		  if (err) {
          return res.negotiate(err);
        }
        var receiversIds = receivers.map(function (model) {
          return model.id;
        });
        User
          .findOneById(req.headers.user)
          .populate('subscribedTo')
          .exec(function (err, user) {
            if (err) {
              return res.negotiate(err);
            }
            if (user) {
              var addSubscriptionIds = [];
              var primary, secondary;
              if (user.subscribedTo.length < receiversIds.length) {
                primary = receiversIds;
                secondary = user.subscribedTo;
              } else {
                primary = user.subscribedTo;
                secondary = receiversIds;
              }
              addSubscriptionIds = primary.filter(function (x) {
                return secondary.indexOf(x) < 0;
              });
              if (addSubscriptionIds.length) {
                user.subscribedTo.add(receivers);
                // TODO: add error handling
                user.save();
              }
              Feed.create({
                text: req.body.text,
                receivers: receivers,
                author: user
              }).exec(function (err, feed) {
          		  if (err) {
                  return res.negotiate(err);
                }
                var roomNames = req.body.receivers.map(function (obj) {
                  return obj.type !== 'all' ? obj.name : 'all';
                });
                if (req.isSocket) {
                  var notBroadcastRooms;
                  if (roomNames.indexOf('all') > -1) {
                    notBroadcastRooms = roomNames.filter(function (room) {
                      return room !== 'all';
                    });
                  } else {
                    notBroadcastRooms = roomNames;
                  }
                  if (notBroadcastRooms.length) {
                    notBroadcastRooms.forEach(function (roomName) {
                      sails.sockets.join(req, roomName);
                    });
                  }
                }
                res.json({ data: feed });
                sails.sockets.broadcast(roomNames, feed);
              });
      			} else {
      				res.json({ error: 'User not found' });
      			}
          });
        });
  },

  get: function (req, res) {
    return res.json({
      todo: 'get() is not implemented yet!'
    });
  },

  update: function (req, res) {
		if (!req.params.id) {
			return res.json({
				error: 'Feed Id is not in request body'
			});
		}
		Feed.update(
      { id: req.params.id },
      req.body
    ).exec(function (err, updated) {
			if (err) {
				return res.negotiate(err);
			}
			res.json({ data: updated });
		});
  },

  delete: function (req, res) {
		if (!req.params.id) {
			return res.json({
				error: 'Feed Id is missing'
			});
		}
    Feed.destroy({
			id: req.params.id
		}).exec(function (err) {
			if (err) {
				res.negotiate(err);
			}
			res.ok();
		});
  }
};
