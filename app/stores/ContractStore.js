var Fluxxor = require('fluxxor');
var constants = require('../libs/constants');

var state = {
  contracts: null,
  updateFailed: false
}

var ConfigStore = Fluxxor.createStore({
  initialize: function () {
    this.bindActions(
      constants.config.UPDATE_SUCCESS, this.handleUpdateSuccess,
      constants.config.UPDATE_FAILED, this.handleUpdateFailed,
      constants.config.UPDATE_IS_DEMO, this.handleUpdateIsDemo
    );
  },

  getState: function () {
    return state;
  },

  handleUpdateSuccess: function (payload) {
    state.contracts = payload.contracts;
    state.updateFailed = false;
    this.emit(constants.CHANGE_EVENT);
  },

  handleUpdateFailed: function (payload) {
    state.contracts = null;
    state.updateFailed = true;
    this.emit(constants.CHANGE_EVENT);
  },

  handleUpdateIsDemo: function (payload) {
    state.isDemo = payload.isDemo;
    state.contracts = payload.contracts;
    state.updateFailed = false;
    this.emit(constants.CHANGE_EVENT);
  }
});

module.exports = ConfigStore;
