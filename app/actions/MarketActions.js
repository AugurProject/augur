var _ = require('lodash');
var constants = require('../libs/constants');

var MarketActions = {

  loadMarkets: function () {

    var currentBranch = this.flux.store('branch').getCurrentBranch();
    var ethereumClient = this.flux.store('config').getEthereumClient();

    var self = this;
    var markets = ethereumClient.getMarkets(currentBranch.id, null, function(progress) {
      var percent = ((progress.current/progress.total) * 100).toFixed(2);
      self.flux.actions.config.updatePercentLoaded(percent);
    });

    // TODO: put this somewhere where markets can be checked on period change
    _.each(markets, function(market) {
      if (currentBranch.currentPeriod >= market.tradingPeriod) market.matured = true;
    }, this);

    if (_.keys(markets).length === 0) self.flux.actions.config.updatePercentLoaded(100);  // sometimes there's no markets

    this.dispatch(constants.market.LOAD_MARKETS_SUCCESS, {markets: markets});
  },

  updateMarkets: function() {

    var branchState = this.flux.store('branch').getState();
    var configState = this.flux.store('config').getState();

    var branchId = branchState.currentBranch.id;
    var currentMarketIds = _.keys(this.flux.store('config').getState().markets);
    
    var ethereumClient = configState.ethereumClient;
    var markets = ethereumClient.getMarkets(branchId, currentMarketIds);

    this.dispatch(constants.market.UPDATE_MARKETS_SUCCESS, {markets: markets});
  },

  updateMarket: function(market) {

    this.dispatch(constants.market.UPDATE_MARKET_SUCCESS, {market: market});
  },

  updateSharesHeld: function(marketId, outcomeId, relativeShares) {

    //console.log(marketId, outcomeId, relativeShares);
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
