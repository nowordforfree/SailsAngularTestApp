/**
 * Feed.js
 *
 * @description :: Model representing chat message.
 */

module.exports = {
  schema: true,
  tableName: 'feed',
  attributes: {
    author : { model: 'user', required: true },
    text: { type: 'string' },
    receivers: { collection: 'receiver' }
  }
};
