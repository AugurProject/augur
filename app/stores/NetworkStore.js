var _ = require('lodash');
var Fluxxor = require('fluxxor');
var constants = require('../libs/constants');
var utilities = require('../libs/utilities');

var state = {
  accounts: null,
  primaryAccount: null,
  peerCount: null,
  blockNumber: null,
  blocktime: null,
  ether: null,
  gasPrice: null,
  ethereumStatus: null,
  mining: null,
  hashrate: null,
  isMonitoringBlocks: false,
  hasCheckedQuorum: false
};

var NetworkStore = Fluxxor.createStore({

  initialize: function () {

    this.bindActions(
      constants.network.LOAD_NETWORK, this.handleUpdateNetwork,
      constants.network.UPDATE_ETHEREUM_STATUS, this.handleUpdateEthereumStatus,
      constants.network.UPDATE_IS_MONITORING_BLOCKS, this.handleUpdateIsMonitoringBlocks
    );
  },

  getState: function () {
    return state;
  },

  getAccount: function () {
    if (_.isNull(state.primaryAccount)) {
      return null;
    }

    var account = state.primaryAccount;
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
  },

  handleUpdateIsMonitoringBlocks: function (payload) {
    state.isMonitoringBlocks = payload.isMonitoringBlocks;
    this.emit(constants.CHANGE_EVENT);
  }
});

module.exports = NetworkStore;
