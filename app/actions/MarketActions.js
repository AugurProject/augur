var _ = require('lodash');
var constants = require('../libs/constants');
var utilities = require('../libs/utilities');

var MarketActions = {

  // returns a function that returns a function that sets a market property to the passed value
  getMarketSetter: function(marketId) {

    var self = this;

    return function(property) {

      return function(value) {

        var market = {'id': marketId};
        market[property] = value;
        self.dispatch(constants.market.UPDATE_MARKET_SUCCESS, {market: market});
      }
    }
  },

  loadMarket: function(marketId) {

    var setProp = this.flux.actions.market.getMarketSetter(marketId);

    var self = this;

    var market = {'id': marketId};

    ethereumClient.getMarketDescription(marketId, setProp('description'));

    ethereumClient.getMarketEvents(marketId, function(events) {

      market['events'] = events;
      // calc end date from first events expiration
      if (events.length) {
        ethereumClient.getEventExpiration(market.events[0], function(expirationBlock) {
          market['endDate'] = utilities.blockToDate(expirationBlock.toNumber());
          self.dispatch(constants.market.UPDATE_MARKET_SUCCESS, {market: market});
          //self.dispatch(constants.market.INITIAL_PAGE_IS_LOADED);
        });
      }
      // check if this market is ready to be closed
      market['expired'] = true;
      market['closed'] = false;
      ethereumClient.getMarketWinningOutcomes(marketId, function(result) {
        var winningOutcomes = result.slice(0, events.length);
        for (var i = 0; i < events.length; ++i) {
          if (market['expired'] && ethereumClient.getEventOutcome(events[i]).toFixed() === "0") {
            market['expired'] = false;
          }
          if (!market['closed'] && Number(winningOutcomes[i]) !== 0) {
            market['closed'] = true;
          }
          if (!market['expired'] && market['closed']) break;
        }
      });
      self.dispatch(constants.market.UPDATE_MARKET_SUCCESS, {market: market});
      //self.dispatch(constants.market.INITIAL_PAGE_IS_LOADED);
    });

    ethereumClient.getMarketAlpha(marketId, setProp('alpha'));
    ethereumClient.getMarketAuthor(marketId, setProp('author'));
    ethereumClient.getMarketCreationFee(marketId, setProp('creationFee'));

    ethereumClient.getMarketTraderCount(marketId, setProp('traderCount'));
    ethereumClient.getMarketTradingPeriod(marketId, setProp('tradingPeriod'));
    ethereumClient.getMarketTradingFee(marketId, setProp('tradingFee'));
    ethereumClient.getMarketTraderId(marketId, function(traderId) {
      market['traderId'] = traderId;
      ethereumClient.getMarketNumOutcomes(marketId, function(numOutcomes) {
        _.each(_.range(1, numOutcomes.toNumber() + 1), function (outcomeId) {
          ethereumClient.getMarketSharesPurchased(marketId, outcomeId, function(volume) {
            var sharesHeld = new BigNumber(0);
            if (traderId !== -1) sharesHeld = ethereumClient.getMarketParticipantSharesPurchased(marketId, traderId, outcomeId);
            ethereumClient.getPrice(marketId, outcomeId, function(price) {
              if (outcomeId === 2) market['price'] = price;  // hardcoded to outcome 2
              if (!market.outcomes) market['outcomes'] = [];
              market['outcomes'][outcomeId-1] = {
                id: outcomeId,
                price: price,
                priceHistory: [],  // NEED
                sharesHeld: sharesHeld,
                volume: volume
              };
              self.dispatch(constants.market.UPDATE_MARKET_SUCCESS, {market: market});
              self.dispatch(constants.market.INITIAL_PAGE_IS_LOADED);
            });
          });
        });
      });
    });

    var account = this.flux.store('network').getAccount();
    market['authored'] = account === market.author;
    market['comments'] = [];

    this.dispatch(constants.market.UPDATE_MARKET_SUCCESS, {market: market});
    //this.dispatch(constants.market.INITIAL_PAGE_IS_LOADED);
  },

  loadMarkets: function() {

    //var startMoment = moment();
    var currentBranch = this.flux.store('branch').getCurrentBranch();
    var ethereumClient = this.flux.store('config').getEthereumClient();

    var marketIds = ethereumClient.getMarkets(currentBranch.id);
    var initialPage = 1;

    // breaks ids into pages
    var marketPageIds = _.chunk(marketIds, constants.MARKETS_PER_PAGE);
    var initialIds = marketPageIds[initialPage - 1];

    // remove initialIds from paged ids and flatten
    marketPageIds.splice(initialPage - 1, 1);
    var remainingIds = _.flatten(marketPageIds);

    // send initial ids to store so it can keep track of when the page is loaded
    this.dispatch(constants.market.INITIAL_PAGE_IS_LOADING, {initialIds: initialIds});

    // set event listener to load the remaining ids after initial is loaded
    this.flux.store('market').once(constants.INITIAL_PAGE_IS_LOADED_EVENT, function() {
      console.log('initial page loaded');
      this.flux.actions.market.loadSomeMarkets(remainingIds);
    });

    this.flux.actions.market.loadSomeMarkets(initialIds);
  },

  loadSomeMarkets: function(marketIds) {

    var currentBranch = this.flux.store('branch').getCurrentBranch();
    console.log('loading', marketIds.length, 'markets');

    _.each(marketIds, function(marketId) {

      console.log('loading', marketId.toString(16));
      var market = {id: marketId, branchId: currentBranch.id, loaded: false};

      this.dispatch(constants.market.ADD_MARKET_SUCCESS, {market: market});
      this.flux.actions.market.loadMarket(market.id);

    }, this);

  },

  loadNewMarkets: function() {

    var currentBranch = this.flux.store('branch').getCurrentBranch();
    var ethereumClient = this.flux.store('config').getEthereumClient();
    var currentMarkets = this.flux.store('market').getState().markets;
    var currentMarketIds = _.map(_.reject(currentMarkets, function(market){
      return typeof(market.id) === 'string' && market.id.match(/pending/);
    }), 'id');

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
