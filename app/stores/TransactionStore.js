var Fluxxor = require('fluxxor');
var constants = require('../libs/constants');

// Map transaction hashes to Transactions.
var state = {}

class Transaction {
  constructor (hash) {
    this.hash = hash;
    this.isMined = false;
  }
}

var TransactionStore = Fluxxor.createStore({
  initialize: function () {
    this.bindActions(
      constants.transaction.ADD_TRANSACTION, this.handleAddTransaction,
      constants.transaction.UPDATE_TRANSACTIONS, this.handleUpdateTransactions
    );
  },

  getState: function () {
    return state;
  },

  handleAddTransaction: function (payload) {
    state[payload.hash] = new Transaction(payload.hash);
    this.emit(constants.CHANGE_EVENT);
  },

  /**
   * Update the stored transactions.
   *
   * @param payload {Object} - Transaction objects keyed by their hashes.
   */
  handleUpdateTransactions: function (payload) {
    var changed = false;
    _.forEach(payload, function (transaction, hash) {
      if (!state[hash]) {
        changed = true;
      } else if (!_.isEqual(state[hash], transaction)) {
        changed = true;
      }
      state[hash] = transaction;
    });

    if (changed) {
      this.emit(constants.CHANGE_EVENT);
    }
  }
});

module.exports = TransactionStore;
