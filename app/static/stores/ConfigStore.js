var Fluxxor = require('fluxxor');
var constants = require('../constants');

var state = {
  host: 'localhost:8080',
  evmAddress: '0x3a52e22178b3ecc3bc7f9918fd81973d33c8d10e',
  isDemo: false,
  contract: null,
  contractFailed: false,
  ethereumStatus: null
}

var ConfigStore = Fluxxor.createStore({
  initialize: function () {
    // TODO: Re-implement loading the evmAddress from a cookie or web3.db.
    this.bindActions(
      constants.config.UPDATE_CONTRACT_SUCCESS, this.handleUpdateContractSuccess,
      constants.config.UPDATE_CONTRACT_FAILED, this.handleUpdateContractFailed,
      constants.config.UPDATE_IS_DEMO, this.handleUpdateIsDemo,
      constants.config.UPDATE_ETHEREUM_STATUS, this.handleUpdateEthereumStatus
    );
  },

  getState: function () {
    return state;
  },

  handleUpdateContractSuccess: function (payload) {
    state.contract = payload.contract;
    state.contractFailed = false;
    state.evmAddress = payload.evmAddress;
    this.emit(constants.CHANGE_EVENT);
  },

  handleUpdateContractFailed: function (payload) {
    state.contract = null;
    state.contractFailed = true;
    state.evmAddress = payload.evmAddress;
    this.emit(constants.CHANGE_EVENT);
  },

  handleUpdateIsDemo: function (payload) {
    state.isDemo = payload.isDemo;
    if (state.isDemo) {
      // In the demo state, we pretend the Ethereum daemon is reachable.
      state.ethereumStatus = constants.config.ETHEREUM_STATUS_CONNECTED;
    }
    state.contractFailed = false;
    this.emit(constants.CHANGE_EVENT);
  },

  handleUpdateEthereumStatus: function (payload) {
    state.ethereumStatus = payload.ethereumStatus;
    this.emit(constants.CHANGE_EVENT);
  }
});

module.exports = ConfigStore;
