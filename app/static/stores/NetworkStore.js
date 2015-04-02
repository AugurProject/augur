var Fluxxor = require('fluxxor');
var constants = require('../constants');

var state = {
  peerCount: null,
  blockNumber: null,
  gas: null,
  gasPrice: null
};

var NetworkStore = Fluxxor.createStore({
  initialize: function () {
    this.bindActions(
      constants.network.UPDATE_NETWORK, this.handleUpdateNetwork
    );
  },

  getState: function () {
    return state;
  },

  handleUpdateNetwork: function (payload) {
    state = payload;
    this.emit(constants.CHANGE_EVENT);
  }
});

module.exports = NetworkStore;
