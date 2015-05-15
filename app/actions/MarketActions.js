var _ = require('lodash');
var constants = require('../libs/constants');

var MarketActions = {

  loadMarkets: function () {
    var branchState = this.flux.store('branch').getState();
    var configState = this.flux.store('config').getState();
    var account = this.flux.store('network').getAccount();

    var branchId = branchState.currentBranch.id;
    var ethereumClient = configState.ethereumClient;
    var markets = ethereumClient.getMarkets(branchId);

    this.dispatch(constants.market.LOAD_MARKETS_SUCCESS, {markets: markets});
  },

  updateMarket: function(market) {

    this.dispatch(constants.market.UPDATE_MARKET_SUCCESS, {market: market});
  },

  addMarket: function(market, pendingId) {

  	// if no market id set, add as pending and return temp id
  	if (_.isUndefined(market.id)) {

	  	// generate temp pending id
	  	var s = JSON.stringify(market);
		  var hash = 0, i, chr, len;
		  for (i = 0, len = s.length; i < len; i++) {
			  chr = s.charCodeAt(i);
			  hash = ((hash << 5) - hash) + chr;
			  hash |= 0;   // convert to 32bit integer
		  }
	  	market.id = new BigNumber(hash);
	  	market.pending = true;

  		this.dispatch(constants.market.ADD_PENDING_MARKET_SUCCESS, {market: market});

  		return market.id;

  	} else {

  		this.dispatch(constants.market.ADD_MARKET_SUCCESS, {market: market, pendingId: pendingId});
  	}
  }
};

module.exports = MarketActions;
