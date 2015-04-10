var Fluxxor = require('fluxxor');
var constants = require('../constants');

var state = {
  balance: null,
  gas: null
}

var AssetStore = Fluxxor.createStore({
  initialize: function () {
    this.bindActions(
      constants.asset.LOAD_ASSETS_SUCCESS, this.handleLoadAssetsSuccess
    );
  },

  getState: function () {
    return state;
  },

  handleLoadAssetsSuccess: function (payload) {
    state.balance = payload.balance;
    state.gas = payload.gas;
    this.emit(constants.CHANGE_EVENT);
  }
});

module.exports = AssetStore;
