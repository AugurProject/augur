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

  handleUpdateNetwork: function (payload) {
    state = payload;
    this.emit(constants.CHANGE_EVENT);
  },

  handleUpdateEthereumStatus: function (payload) {
    state.ethereumStatus = payload.ethereumStatus;
    this.emit(constants.CHANGE_EVENT);
  }
});

module.exports = NetworkStore;
