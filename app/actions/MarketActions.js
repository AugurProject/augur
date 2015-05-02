var _ = require('lodash');
var constants = require('../libs/constants');

var MarketActions = {

  loadMarkets: function () {
    var branchState = this.flux.store('branch').getState();
    var configState = this.flux.store('config').getState();
    var account = this.flux.store('network').getAccount();

    var branchId = branchState.currentBranch;
    var ethereumClient = configState.ethereumClient;
    var markets = ethereumClient.getMarkets(branchId);

    this.dispatch(constants.market.LOAD_MARKETS_SUCCESS, {markets: markets});
  }
};

module.exports = MarketActions;
