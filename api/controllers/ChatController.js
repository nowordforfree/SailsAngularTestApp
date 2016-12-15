/**
 * ChatController
 *
 * @description :: Server-side logic for managing Chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getChatsList: function (req, res) {
    Chat.find({}).exec(function (err, list) {
      if (err) {
        return res.json(err.status, {error: err});
      }
      if (list) {
        res.json(200, { chat: list });
      }
    });
	},
	getChat: function (req, res) {
		var chatName = req.param('name');
		if (!chatName) {
			return res.json({error: 'Chat name is missing'});
		}
    Chat.findOne({name: chatName}).exec(function (err, chat) {
      if (err) {
        return res.json(err.status, {error: err});
      }
      if (chat) {
        res.json(200, { chat: chat });
      }
    });
	},
	createChat: function (req, res) {
		var newChatName = 'New Chat';
		if (req.body.name) {
			newChatName = req.body.name;
		}
		Chat.create({ name: newChatName }).exec(function (err, chat) {
			if (err) {
				return res.json(err.status, { error: err });
			}
			res.json(200, { chat: chat });
		})
	},
	postMessage: function (req, res) {
		if (!req.body.author) {
			res.json(400, { error: 'Required field is missing' });
		}
		Chat.findOne({ name: req.param('name') }).exec(function (err, chat) {
			if (err) {
				return res.json(err.status, { error: err });
			}
			chat.messages.add({ author: req.body.author, text: req.body.text });
			chat.save(function (err) {
				if (err) {
					return res.json(err.status, { error: err });
				}
				res.json(200, { chat: chat });
			})
		})
		res.json(200, { message: 'Not implented yet' });
	}
};
