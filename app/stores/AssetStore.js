var Fluxxor = require('fluxxor');
var constants = require('../libs/constants');

var state = {
  cash: null,
  reputation: null,
  ether: null
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
    state.cash = payload.cash;
    state.ether = payload.ether;
    state.reputation = payload.reputation;
    this.emit(constants.CHANGE_EVENT);
  }
});

module.exports = AssetStore;
