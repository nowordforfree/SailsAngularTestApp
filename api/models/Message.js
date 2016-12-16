/**
 * Message.js
 *
 * @description :: Model representing chat message.
 */

module.exports = {
  attributes: {
    author : { model: 'User', required: true },
    text: { type: 'string' },
    chat: { model: 'Chat' }
  }
};
