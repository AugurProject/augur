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
  },

  addMarket: function(market) {

  	console.log(market);

  	// generate temp pending id
  	var s = JSON.stringify(market);
	var hash = 0, i, chr, len;
	for (i = 0, len = s.length; i < len; i++) {
		chr = s.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0;   // convert to 32bit integer
	}
  	var pendingId = hash;
  	console.log(pendingId);

  	this.dispatch(constants.market.ADD_MARKET_SUCCESS, {id: pendingId, market: market});

  	return pendingId;
  }
};

module.exports = MarketActions;
