var Fluxxor = require('fluxxor');
var constants = require('../libs/constants');
var momemnt = require('moment');

// Map transaction hashes to Transactions.
var state = {}

class Transaction {
  constructor (tx) {
    this.txHash = tx.hash;
    this.from = null;
    this.to = null;
    this.timestamp = moment();
    this.blockNumber = null;
    this.type = tx.type;
    this.description = tx.description;
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

    state[payload.hash].type = payload.type;
    state[payload.hash].description = payload.description;

    this.emit(constants.CHANGE_EVENT);
  },

  /**
   * Update the stored transactions.
   *
   * @param payload [Array] - Transaction objects
   */
  handleUpdateTransactions: function (payload) {
    var changed = false;
    _.each(payload, function (transaction, hash) {
      if (!state[hash]) {
        changed = true;
      } else if (!_.isEqual(state[hash], transaction)) {
        changed = true;
      }
      state[hash] = _.merge(state[hash], transaction);
    });

    if (changed) {
      this.emit(constants.CHANGE_EVENT);
    }
  }
});

module.exports = TransactionStore;
