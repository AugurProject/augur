var Fluxxor = require('fluxxor');
var constants = require('../libs/constants');

var state = {
  cash: null,
  reputation: null,
  ether: null,
  marketsHeld: {}
}

var AssetStore = Fluxxor.createStore({
  
  initialize: function () {
    this.bindActions(
      constants.asset.UPDATE_ASSETS, this.handleUpdateAssets
    );
  },

  getState: function () {
    return state;
  },

  handleUpdateAssets: function (payload) {
    state = _.merge(state, payload);
    this.emit(constants.CHANGE_EVENT);
  }
});

module.exports = AssetStore;