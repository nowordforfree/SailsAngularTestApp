/**
 * Receiver.js
 *
 * @description :: Receiver model (who will get feed)
 */

module.exports = {
  schema: true,
  tableName: 'receiver',
  attributes: {
    type: {
      type: 'string',
      enum: [ 'all', 'group', 'label', 'user' ],
      defaultsTo: 'all'
    },
    key : { type: 'string' }
  }
};
