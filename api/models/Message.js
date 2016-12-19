/**
 * Message.js
 *
 * @description :: Model representing chat message.
 */

module.exports = {
  attributes: {
    author : { model: 'User', required: true },
    username: { type: 'string' },
    text: { type: 'string' },
    chat: { model: 'Chat' }
  }
};
