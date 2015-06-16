var _ = require('lodash');
var constants = require('../libs/constants');
var utilities = require('../libs/utilities');

var MarketActions = {

  loadMarket: function(marketId) {

    var market = {'id': marketId};
    market['description'] = ethereumClient.getMarketDescription(marketId);
    market['events'] = ethereumClient.getMarketEvents(marketId);
    market['alpha'] = ethereumClient.getMarketAlpha(marketId);
    market['author'] = ethereumClient.getMarketAuthor(marketId);
    market['creationFee'] = ethereumClient.getMarketCreationFee(marketId);

    this.dispatch(constants.market.UPDATE_MARKET_SUCCESS, {market: market});
    
    // calc end date from first events expiration
    if (market.events.length) {
      var expirationBlock = ethereumClient.getEventExpiration(market.events[0]);
      market['endDate'] = utilities.blockToDate(expirationBlock.toNumber());
    }

    market['traderCount'] = ethereumClient.getMarketTraderCount(marketId);
    market['tradingPeriod'] = ethereumClient.getMarketTradingPeriod(marketId);
    market['tradingFee']= ethereumClient.getMarketTradingFee(marketId);
    market['traderId']= ethereumClient.getMarketTraderId(marketId);
    market['outcomes'] = ethereumClient.getMarketOutcomes(marketId, market['traderId']);
    market['price'] = market.outcomes.length ? market.outcomes[1].price : new BigNumber(0);  // hardcoded to outcome 2 (yes)

    this.dispatch(constants.market.UPDATE_MARKET_SUCCESS, {market: market});

    // calc total volume
    var totalVolume =_.reduce(market.outcomes, function(totalVolume, outcome) {
      return totalVolume + parseFloat(outcome.price);
    }, 0);
    market['totalVolume'] = totalVolume;

    // check if this market is ready to be closed
    market['expired'] = true;
    market['closed'] = false;
    var winningOutcomes = ethereumClient.getMarketWinningOutcomes(marketId).slice(0, market.events.length);
    for (var i = 0; i < market.events.length; ++i) {
      if (market['expired'] && ethereumClient.getEventOutcome(market.events[i]).toFixed() === "0") {
        market['expired'] = false;
      }
      if (!market['closed'] && Number(winningOutcomes[i]) !== 0) {
        market['closed'] = true;
      }
      if (!market['expired'] && market['closed']) break;
    }

    var account = this.flux.store('network').getAccount();
    market['authored'] = account === market.author;
    market['invalid'] = market.outcomes.length ? false : true;
    market['comments'] = [];

    this.dispatch(constants.market.UPDATE_MARKET_SUCCESS, {market: market});
  },

  loadMarkets: function() {

    var startMoment = moment();
    var currentBranch = this.flux.store('branch').getCurrentBranch();
    var ethereumClient = this.flux.store('config').getEthereumClient();

    var marketIds = ethereumClient.getMarkets(currentBranch.id);
    var progress = {total: marketIds.length, current: 0};
    this.flux.actions.config.updatePercentLoaded(100);  // hack no progress bar

    _.each(marketIds, function(marketId) {

      var market = {id: marketId};
      this.dispatch(constants.market.ADD_MARKET_SUCCESS, {market: market});
      this.flux.actions.market.loadMarket(market.id);

      // update progress
      //progress.current += 1;
      //var percent = ((progress.current/progress.total) * 100).toFixed(2);
      //this.flux.actions.config.updatePercentLoaded(percent);

    }, this);

    var seconds = moment().diff(startMoment) / 1000;
    utilities.debug(marketIds.length + ' markets loaded in ' + seconds + ' seconds');
  },

  loadNewMarkets: function() {

    var currentBranch = this.flux.store('branch').getCurrentBranch();
    var ethereumClient = this.flux.store('config').getEthereumClient();
    var currentMarkets = this.flux.store('market').getState().markets;
    var currentMarketIds = _.map(currentMarkets, 'id');

    var newMarketIds = ethereumClient.getMarkets(currentBranch.id, currentMarketIds);

    _.each(newMarketIds, function(marketId) {

      utilities.log('new market '+ marketId);
      var market = {id: marketId};
      this.dispatch(constants.market.ADD_MARKET_SUCCESS, {market: market});
      this.flux.actions.market.loadMarket(market.id);

    }, this);
  },

  addPendingMarket: function(market, pendingId) {

  	// generate temp pending id
  	var s = JSON.stringify(market);
	  var hash = 0, i, chr, len;
	  for (i = 0, len = s.length; i < len; i++) {
		  chr = s.charCodeAt(i);
		  hash = ((hash << 5) - hash) + chr;
		  hash |= 0;   // convert to 32bit integer
	  }
  	market.id = 'pending.'+new BigNumber(hash);
  	market.pending = true;

		this.dispatch(constants.market.ADD_PENDING_MARKET_SUCCESS, {market: market});

		return market.id;
  },

  deleteMarket: function(marketId) {

    this.dispatch(constants.market.DELETE_MARKET_SUCCESS, {marketId: marketId});
  }
};

module.exports = MarketActions;
