var _ = require('lodash');
var Fluxxor = require('fluxxor');
var constants = require('../libs/constants');
var utilities = require('../libs/utilities');

var state = {
  peerCount: null,
  blockNumber: null,
  blocktime: null,
  ether: null,
  gasPrice: null,
  ethereumStatus: null,
  mining: null,
  hashrate: null,
  clientVersion: null,
  networkId: null,
  blockChainAge: null,
  isMonitoringBlocks: false,
  hasCheckedQuorum: false
};

var NetworkStore = Fluxxor.createStore({

  initialize: function () {

    this.bindActions(
      constants.network.UPDATE_NETWORK, this.handleUpdateNetwork,
      constants.network.UPDATE_ETHEREUM_STATUS, this.handleUpdateEthereumStatus,
      constants.network.UPDATE_IS_MONITORING_BLOCKS, this.handleUpdateIsMonitoringBlocks,
      constants.network.UPDATE_BLOCK_CHAIN_AGE, this.handleUpdateBlockChainAge
    );
  },

  getState: function () {
    return state;
  },

  handleUpdateNetwork: function (payload) {
    _.merge(state, payload);
    this.emit(constants.CHANGE_EVENT);
  },

  handleUpdateBlockChainAge: function (payload) {
    state.blockChainAge = payload.blockChainAge;
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
