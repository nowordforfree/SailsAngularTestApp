/**
 * ChatController
 *
 * @description :: Server-side logic for managing Chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getChatsList: function (req, res) {
		if (req.isSocket) {
			Chat.watch(req);
		}
		Chat
			.find()
			.exec(function (err, chats) {
				if (err) {
					return res.serverError(err);
				}
				res.json({ chat: chats });
			});
	},
	getChat: function (req, res) {
		var chatName = req.param('name');
		if (!chatName) {
			return res.json({error: 'Chat name is missing'});
		}
		if (!req.headers.user) {
			return res.json({ error: 'No header with user id found' });
		}
    Chat.findOne({name: chatName})
				.populate('participants')
				.populate('messages', {
					limit: 100,
					sort: 'createdAt DESC'
				})
				.exec(function (err, chat) {
		      if (err) {
		        return res.json(err.status, {error: err});
		      }
		      if (chat) {
						chat.participants.add(req.headers.user);
						chat.save(function (err) {
							if (err) {
								res.serverError(err);
							}
							if (req.isSocket) {
								Chat.subscribe(req, chat.id);
							}
							res.json(200, { chat: chat });
						});
					} else {
						res.json(200, { chat: null });
					}
		    });
	},
	createChat: function (req, res) {
		if (!req.isSocket) {
			return res.badRequest('Only client sockets allowed for creating new chat rooms');
		}
		if (!req.headers.user) {
			return res.json({ error: 'No header with user id found' });
		}
		var self = this;
		var newChatName = 'New Chat';
		if (req.body.name) {
			newChatName = req.body.name;
		}
		Chat.create({ name: newChatName })
				.exec(function (err, chat) {
					if (err) {
						return res.serverError(err);
					}
					sails.sockets.join(req, newChatName, function (err) {
						if (err) {
							return res.serverError(err);
						}
						User
							.findOneById(req.headers.user)
							.exec(function (err, user) {
								if (err) {
									return res.serverError(err);
								}
								if (user) {
									chat.participants.add(user.id);
									chat.save(function (err) {
										if (err) {
											return res.serverError(err);
										}
										res.json({ message: 'Subscribed to chat room ' + newChatName });
									});
								} else {
									res.json({ error: 'User not found' });
								}
							});
					});
				});
	},
	postMessage: function (req, res) {
		if (!req.body.author) {
			res.json(400, { error: 'Required field is missing' });
		}
		Chat
			.findOne({ name: req.param('name') })
			.populateAll()
			.exec(function (err, chat) {
				if (err) {
					return res.serverError(err);
				}
				var message = {
					author: req.body.author,
					text: req.body.text,
					chat: chat.id
				};
				Message
					.create(message)
					.exec(function (err, msg) {
						chat.messages.add(msg.id);
						chat.save(function (err) {
							if (err) {
								return res.json(err.status, { error: err });
							}
							console.log(chat);
							Chat.publishAdd(chat.id, 'messages', msg);
						});
					});
			});
	}
};
