var _ = require('lodash');
var constants = require('../libs/constants');
var utilities = require('../libs/utilities');

var MarketActions = {

  loadMarkets: function() {

    var initialPage = 1;

    //var startMoment = moment();
    var currentBranch = this.flux.store('branch').getCurrentBranch();
    var ethereumClient = this.flux.store('config').getEthereumClient();

    var marketIds = ethereumClient.getMarkets(currentBranch.id);

    // initialize all markets
    var markets = {}
    _.each(marketIds, function(id) {
      markets[id] = this.flux.actions.market.initMarket(id);
    }, this);
    this.dispatch(constants.market.LOAD_MARKETS_SUCCESS, {markets: markets});

    // breaks ids into pages
    var marketPageIds = _.chunk(marketIds, constants.MARKETS_PER_PAGE);  // load one page at a time
    //var marketPageIds = [marketIds];   // load all at once

    // setup page loading
    this.dispatch(constants.market.MARKETS_LOADING, {marketLoadingIds: marketPageIds, loadingPage: initialPage});

    // load initial markets
    this.flux.actions.market.loadSomeMarkets(marketPageIds[initialPage-1]);
  },

  loadNewMarkets: function() {

    var currentBranch = this.flux.store('branch').getCurrentBranch();
    var ethereumClient = this.flux.store('config').getEthereumClient();
    var currentMarkets = this.flux.store('market').getState().markets;
    var currentMarketIds = _.map(_.reject(currentMarkets, function(market){
      return typeof(market.id) === 'string' && market.id.match(/pending/);
    }), 'id');

    var newMarketIds = ethereumClient.getMarkets(currentBranch.id, currentMarketIds);

    if (newMarketIds.length) this.flux.actions.market.loadSomeMarkets(newMarketIds);
  },

  loadMarket: function(marketId) {

    this.flux.actions.market.loadSomeMarkets([marketId]);
  },

  loadSomeMarkets: function(marketIds) {

    var ethereumClient = this.flux.store('config').getEthereumClient();
    var markets =  this.flux.store('market').getState().markets;
    var commands = [];

    _.each(marketIds, function(marketId) {
      
      // initialize market if it doesn't exist
      if (!markets[marketId]) {
        var market = this.flux.actions.market.initMarket(marketId);
        this.dispatch(constants.market.ADD_MARKET_SUCCESS, {market: market});
      }
      commands = commands.concat(this.flux.actions.market.batchMarket(marketId));

    }, this);

    // send batch in chunks
    _.each(_.chunk(commands, 30), function(chunk) {
      ethereumClient.batch(chunk);
    });
  },

  batchMarket: function(marketId) {

    var setProp = this.flux.actions.market.getMarketSetter(marketId);
    var commands = [];
    var account = ethereumClient.account;
    var market = {id: marketId, outcomes: [], comments: []};

    commands.push(['getCreationFee', [marketId], setProp('creationFee')]);
    commands.push(['getDescription', [marketId], setProp('description')]);

    commands.push(['getMarketEvents', [marketId], function(events) {

      market['events'] = events;

      // calc end date from first event expiration
      if (events.length) {

        ethereumClient.getEventExpiration(market.events[0], function(expirationBlock) {

          market['endDate'] = utilities.blockToDate(expirationBlock.toNumber());
          this.flux.actions.market.updateMarket(market);

        }.bind(this));

      } else {

        market['invalid'] = true
      }

      // batch version no worky
      ethereumClient.getMarketAuthor(marketId, function(author) {
          market['author'] = author;
          this.flux.actions.market.updateMarket(market);  
      }.bind(this));

      // assumming one event per market
      //ethereumClient.getMarketWinningOutcomes(marketId, function(result) {
      //  market['winningOutcomes'] = result.slice(0, events.length);
      //});
      //ethereumClient.getEventOutcome(events[0], function(result) {
      //  market['eventOutcome'] = result.toFixed();
      //});

      this.flux.actions.market.updateMarket(market);

    }.bind(this)]);

    commands.push(['getMarketInfo', [marketId], function(result) {

      //console.log(result);
      market['traderCount'] = new BigNumber(result[0]);
      market['alpha'] = utilities.fromFixedPoint(new BigNumber(result[1]));
      market['numOutcomes'] = parseInt(result[3]);
      market['tradingPeriod'] = new BigNumber(result[4]);
      market['tradingFee'] = utilities.fromFixedPoint(new BigNumber(result[5]));
      
      if (market['numOutcomes'] < 2) market['invalid'] = true;

      this.flux.actions.market.updateMarket(market);

      ethereumClient.getMarketTraderId(marketId, function(traderId) {

        // populate outcome data
        _.each(_.range(1, market.numOutcomes+1), function (outcomeId) {

          market['outcomes'][outcomeId-1] = {id: outcomeId, sharesHeld: new BigNumber(0)};
          market['outcomes'][outcomeId-1]['priceHistory'] = []  // NEEDED
          market['outcomes'][outcomeId-1]['volume'] = 0;

          this.flux.actions.market.updateMarket(market);

          if (traderId !== -1) {

            ethereumClient.getMarketParticipantSharesPurchased(marketId, traderId, outcomeId, function(sharesHeld) {

              market['outcomes'][outcomeId-1]['sharesHeld'] = sharesHeld;
              this.flux.actions.market.updateMarket(market);

            }.bind(this));
          }

          ethereumClient.getPrice(marketId, outcomeId, function(price) {

            if (outcomeId === 2) market['price'] = price;  // hardcoded to outcome 2 (yes)
            market['outcomes'][outcomeId-1]['price'] = price;
            this.flux.actions.market.updateMarket(market);

          }.bind(this));

        }, this);

      }.bind(this));

    }.bind(this)]);

    return commands;
  },

  updateMarket: function(market) {

    this.dispatch(constants.market.UPDATE_MARKET_SUCCESS, {market: market});

    var marketState = this.flux.store('market').getState();

    // initial markets loading
    if (marketState.loadingPage) {

      // use this progressbar for all markets
      //var totalLoaded = _.map(marketState.markets, 'loaded');
      //var percentLoaded = (_.filter(totalLoaded).length / totalLoaded.length) * 100;
      //this.flux.actions.config.updatePercentLoaded(percentLoaded);

      var marketsPage = _.filter(marketState.markets, function(market) {
        return _.contains(marketState.marketLoadingIds[marketState.loadingPage-1], market.id);
      });
      var pageLoaded = _.map(marketsPage, 'loaded');

      // use this progress bar for initial page only
      var percentLoaded = (_.filter(pageLoaded).length / pageLoaded.length) * 100;
      this.flux.actions.config.updatePercentLoaded(percentLoaded);

      if (pageLoaded.length && !_.includes(pageLoaded, false)) {

        // check if next page exists
        var nextPage = marketState.loadingPage + 1;
        if (marketState.marketLoadingIds[nextPage-1]) {

          this.dispatch(constants.market.MARKETS_LOADING, {loadingPage: nextPage});
          this.flux.actions.market.loadSomeMarkets(marketState.marketLoadingIds[nextPage-1]);

        } else {

          this.dispatch(constants.market.MARKETS_LOADING, {loadingPage: null});
          this.flux.actions.config.updatePercentLoaded(100);
        }
      }
    }
  },

  // return a skeleton market (TODO: let's move to a market class!)
  initMarket: function(marketId) {

    var currentBranch = this.flux.store('branch').getCurrentBranch();
    return {id: marketId, branchId: currentBranch.id, loaded: false};  
  },

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
