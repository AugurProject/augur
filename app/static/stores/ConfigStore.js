var Fluxxor = require('fluxxor');
var constants = require('../constants');

var state = {
  evmAddress: '0x01202a04dc223ae5f87b473ef11c2ec372e4b0be',
  isDemo: false,
  contract: null
}

var ConfigStore = Fluxxor.createStore({
  initialize: {
    this.bindActions(
      constants.config.UPDATE_CONTRACT, this.handleUpdateContract,
      constants.config.UPDATE_IS_DEMO, this.handleUpdateIsDemo
    );
  },

  getState: function () {
    return state;
  },

  handleUpdateContract: function (payload) {
    state.contract = payload.contract;
    state.evmAddress = payload.evmAddress;
    this.emit(constants.CHANGE_EVENT);
  },

  handleUpdateIsDemo: function (payload) {
    state.isDemo = payload.isDemo;
    this.emit(constants.CHANGE_EVENT);
  }
});

module.exports = ConfigStore;
