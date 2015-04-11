var _ = require('lodash');
var Fluxxor = require('fluxxor');
var constants = require('../constants');

var state = {
  accounts: null,
  peerCount: null,
  blockNumber: null,
  gas: null,
  gasPrice: null,
  ethereumStatus: null
};

var NetworkStore = Fluxxor.createStore({

  initialize: function () {
    this.bindActions(
      constants.network.UPDATE_NETWORK, this.handleUpdateNetwork,
      constants.network.UPDATE_ETHEREUM_STATUS, this.handleUpdateEthereumStatus
    );
  },

  getState: function () {
    return state;
  },

  getWeb3: function () {

    console.log(state);
    if (state.ethereumStatus === constants.network.ETHEREUM_STATUS_CONNECTED) {
      return require('web3');
    } else {
      return require('../demo').web3;
    }
  },

  /**
   * Get the currently selected account.
   *
   * TODO: This currently returns the first account in the list, but users
   * will eventually be able to choose an account, which will be stored as
   * currentAccount in this store.
   */
  getAccount: function () {
    if (_.isNull(state.accounts)) {
      return null;
    }

    var account = state.accounts[0];
    if (_.isUndefined(account)) {
      return null;
    }

    return account;
  },

  handleUpdateNetwork: function (payload) {
    _.merge(state, payload);
    this.emit(constants.CHANGE_EVENT);
  },

  handleUpdateEthereumStatus: function (payload) {
    state.ethereumStatus = payload.ethereumStatus;
    this.emit(constants.CHANGE_EVENT);
  }
});

module.exports = NetworkStore;
