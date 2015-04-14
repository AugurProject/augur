var Fluxxor = require('fluxxor');
var constants = require('../libs/constants');

var state = {
  balance: null,
  reputation: null,
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
    state.reputation = payload.reputation;
    this.emit(constants.CHANGE_EVENT);
  }
});

module.exports = AssetStore;
