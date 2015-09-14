var _ = require('lodash');
var abi = require('augur-abi');
var constants = require('../libs/constants');
var utilities = require('../libs/utilities');
var blacklist = require('../libs/blacklist');

var MarketActions = {

  loadMarkets: function () {
    var self = this;
    var initialPage = 1;
    var currentBranch = this.flux.store('branch').getCurrentBranch();

    // if we're on a hosted node, load preprocessed market data
    if (!augur.rpc.nodes.local) {
      var branchId = currentBranch.id;
      var account = this.flux.store('config').getAccount();
      augur.rpc.blockNumber(function (block) {
        $.get(constants.MONGODB, function (data) {
          var blacklisted, markets, realMarkets = [];
          markets = JSON.parse(data).rows;
          for (var i = 0, len = markets.length; i < len; ++i) {
            blacklisted = _.contains(
              blacklist.markets[augur.network_id][branchId],
              abi.strip_0x(markets[i]._id)
            );
            if (!blacklisted && !markets[i].invalid && markets[i].price &&
                markets[i].description)
            {
              markets[i].endDate = moment().add(
                (markets[i].endDate - block)*constants.SECONDS_PER_BLOCK,
                "seconds"
              );
              markets[i].price = abi.bignum(markets[i].price);
              markets[i].tradingFee = abi.bignum(markets[i].tradingFee);
              markets[i].creationFee = abi.bignum(markets[i].creationFee);
              markets[i].traderCount = abi.bignum(markets[i].traderCount);
              markets[i].alpha = abi.bignum(markets[i].alpha);
              markets[i].numOutcomes = parseInt(markets[i].numOutcomes);
              markets[i].tradingPeriod = abi.bignum(markets[i].tradingPeriod);
              markets[i].branchId = branchId;
              markets[i].loaded = true;
              markets[i].traderId = abi.bignum(markets[i].participants[account]);
              if (markets[i].outcomes && markets[i].outcomes.length) {
                for (var j = 0; j < markets[i].outcomes.length; ++j) {
                  markets[i].outcomes[j].sharesHeld = abi.bignum(
                    markets[i].outcomes[j].shares[account]
                  );
                }
              }
              realMarkets.push(markets[i]);
            }
          }
          self.dispatch(constants.market.LOAD_MARKETS_SUCCESS, {
            markets: _.sortBy(realMarkets, "endDate").reverse()
          });
          self.flux.actions.config.updatePercentLoaded(100);
        });
      });

    // if we're on a local node, get data directly from geth via RPC
    } else {
      var ethereumClient = this.flux.store('config').getEthereumClient();
      var marketIds = ethereumClient.getMarkets(currentBranch.id);

      // initialize all markets
      var markets = {};
      _.each(marketIds, function (id) {
        markets[id] = this.flux.actions.market.initMarket(id);
      }, this);

      this.dispatch(constants.market.LOAD_MARKETS_SUCCESS, { markets: markets });

      // breaks ids into pages
      // load one page at a time
      var marketPageIds = _.chunk(marketIds, constants.MARKETS_PER_PAGE);
      // load all at once
      // var marketPageIds = [marketIds];

      // setup page loading
      this.dispatch(constants.market.MARKETS_LOADING, {
        marketLoadingIds: marketPageIds,
        loadingPage: initialPage
      });

      // load initial markets
      this.flux.actions.market.loadSomeMarkets(marketPageIds[initialPage-1]);

      // short circuit loading if no markets
      if (!_.keys(marketIds).length) this.flux.actions.config.updatePercentLoaded(100);
    }
  },

  loadNewMarkets: function () {
    if (!augur.rpc.nodes.local) {
      this.flux.actions.market.loadMarkets();
    } else {
      var currentBranch = this.flux.store('branch').getCurrentBranch();
      var ethereumClient = this.flux.store('config').getEthereumClient();
      var currentMarkets = this.flux.store('market').getState().markets;
      var currentMarketIds = _.map(_.reject(currentMarkets, function (market) {
        return typeof(market.id) === 'string' && market.id.match(/pending/);
      }), 'id');
      var newMarketIds = ethereumClient.getMarkets(currentBranch.id, currentMarketIds);
      if (newMarketIds.length) this.flux.actions.market.loadSomeMarkets(newMarketIds);
    }
  },

  loadMarket: function (marketId) {
    var self = this;
    if (!augur.rpc.nodes.local) {
      var branchId = currentBranch.id;
      var block = augur.rpc.blockNumber();
      var account = this.flux.store('config').getAccount();
      augur.rpc.blockNumber(function (block) {
        var market = this.flux.store('markets').getMarket(marketId);
        if (market) {
          this.dispatch(constants.market.UPDATE_MARKET_SUCCESS, { market: market });
        } else {
          var marketId = abi.prefix_hex(abi.bignum(marketId).toString(16));
          $.get(constants.MONGODB, function (data) {
            var markets, blacklisted;
            markets = JSON.parse(data).rows;
            for (var i = 0, len = markets.length; i < len; ++i) {
              blacklisted = _.contains(
                blacklist.markets[augur.network_id][branchId],
                abi.strip_0x(markets[i]._id)
              );
              if (!blacklisted && !markets[i].invalid && markets[i].price &&
                  markets[i].description)
              {
                if (markets[i]._id === marketId) {
                  market = markets[i];
                  market.endDate = moment().add(
                    (market.endDate - block)*constants.SECONDS_PER_BLOCK,
                    "seconds"
                  );
                  market.price = abi.bignum(market.price);
                  market.tradingFee = abi.bignum(market.tradingFee);
                  market.creationFee = abi.bignum(market.creationFee);
                  market.traderCount = abi.bignum(market.traderCount);
                  market.alpha = abi.bignum(market.alpha);
                  market.numOutcomes = parseInt(market.numOutcomes);
                  market.tradingPeriod = abi.bignum(market.tradingPeriod);
                  market.branchId = branchId;
                  market.loaded = true;
                  market.traderId = abi.bignum(market.participants[account]);
                  if (market.outcomes && market.outcomes.length) {
                    for (var j = 0; j < market.outcomes.length; ++j) {
                      market.outcomes[j].sharesHeld = abi.bignum(
                        market.outcomes[j].shares[account]
                      );
                    }
                  }
                  break;
                }
              }
            }
            self.dispatch(constants.market.UPDATE_MARKET_SUCCESS, { market: market });
          });
        }
      });
    } else {
      this.flux.actions.market.loadSomeMarkets([marketId]);
    }
  },

  loadSomeMarkets: function(marketIds) {

    var ethereumClient = this.flux.store('config').getEthereumClient();
    var markets =  this.flux.store('market').getState().markets;

    _.each(marketIds, function (marketId) {

      // initialize market if it doesn't exist
      if (!markets[marketId]) {
        var market = this.flux.actions.market.initMarket(marketId);

        // TODO each of these should not be a separate event
        this.dispatch(constants.market.ADD_MARKET_SUCCESS, { market: market });
      }
      var commands = this.flux.actions.market.batchMarket(marketId);
      _.each(_.chunk(commands, 5), function(chunk) {
          ethereumClient.batch(chunk);
      });
    }, this);
  },

  // first batch of data fetch from market
  batchMarket: function (marketId) {
    var self = this;
    var setProp = this.flux.actions.market.getMarketSetter(marketId);
    var account = this.flux.store('config').getAccount();
    var market = { id: marketId, outcomes: [], comments: [] };
    var commands = [];

    marketId = abi.prefix_hex(marketId.toString(16));

    commands.push(['getCreationFee', [marketId], setProp('creationFee')]);
    commands.push(['getDescription', [marketId], setProp('description')]);
    commands.push(['getCreator', [marketId], setProp('author')]);
    commands.push(['getMarketEvents', [marketId], setProp('events')]);
    commands.push(['getParticipantNumber', [marketId, account], setProp('traderId')]);
    commands.push(['getMarketInfo', [marketId], function (result) {

      market['traderCount'] = result[0];
      market['alpha'] = abi.unfix(result[1]);
      market['numOutcomes'] = parseInt(result[3]);
      market['tradingPeriod'] = result[4];
      market['tradingFee'] = abi.unfix(result[5]);
      if (market['numOutcomes'] < 2) market['invalid'] = true;

      // initialize outcomes
      _.each(_.range(1, market.numOutcomes+1), function (outcomeId) {
        market['outcomes'][outcomeId-1] = {
          id: outcomeId,
          sharesHeld: new BigNumber(0)
        };
        market['outcomes'][outcomeId-1]['priceHistory'] = []  // NEEDED
        market['outcomes'][outcomeId-1]['outstandingShares'] = 0;
      });

      self.flux.actions.market.updateMarket(market);
    }]);
    return commands;
  },

  // second, supplement batch of data fetched after above prereqs are acquired
  batchSupplementMarket: function(market) {
    var self = this;
    var commands = [];
    var account = this.flux.store('config').getAccount();
    var marketId = abi.prefix_hex(abi.bignum(market.id).toString(16));

    // populate outcome data
    _.each(market.outcomes, function (outcome) {

      if (market.traderId !== -1 ) {
        commands.push([
          'getParticipantSharesPurchased',
          [marketId, abi.prefix_hex(market.traderId), outcome.id],
          function (result) {
            outcome['sharesHeld'] = abi.unfix(result);
            self.flux.actions.market.updateMarket(market, true);
          }
        ]);
      }

      commands.push(['getMarketOutcomeInfo', [marketId, outcome.id], function (info) {
        if (info && info.length) {

          outcome['outstandingShares'] = abi.unfix(info[0]);
          if (market.traderId && market.traderId.toNumber() !== -1) {
            outcome['sharesHeld'] = abi.unfix(info[1]);
          }
          var price = abi.unfix(info[2]);
          if (outcome.id === 2) market['price'] = price;  // hardcoded to outcome 2 (yes)
          outcome['price'] = price;
          market['traderCount'] = info[4];

          self.flux.actions.market.updateMarket(market, true);
        }
      }]);
      
    }, this);

    if (market.events.length) {

      var marketEvent = abi.prefix_hex(market.events[0].toString(16));

      commands.push(['getEventInfo', [marketEvent], function (eventInfo) {
        if (eventInfo[1]) {
          // calc end date from first event expiration
          var expirationBlock = new BigNumber(eventInfo[1]).toNumber();
          market['endDate'] = utilities.blockToDate(expirationBlock);

          // TODO each of these should not trigger an update
          self.flux.actions.market.updateMarket(market, true);
        }
      }]);

      commands.push(['getWinningOutcomes', [marketId], function (result) {
        if (result && result.length) {
          market['winningOutcomes'] = result.slice(0, market.events.length);

          // TODO each of these should not trigger an update
          self.flux.actions.market.updateMarket(market, true);
        }
      }]);

      commands.push(['getOutcome', [marketEvent], function (result) {

        // TODO there will need to be an outcome for each event
        market['eventOutcome'] = result.toFixed();

        // TODO each of these should not trigger an update
        self.flux.actions.market.updateMarket(market, true);
      }]);

    } else {
      market['invalid'] = true
    }

    return commands;
  },

  updateMarket: function(market, supplement) {
    if (market && market.id && market.id !== "0x") {
      var marketId = abi.prefix_hex(abi.bignum(market.id).toString(16));

      // Calculate market properties before dispatch (seems to belong in a Market class)
      if (!market.outstandingShares && market.outstandingShares !== 0) {
        market.outstandingShares = _.reduce(market.outcomes, function(outstandingShares, outcome) {
          if (outcome) return outstandingShares + parseFloat(outcome.outstandingShares);
        }, 0);
      }

      this.dispatch(constants.market.UPDATE_MARKET_SUCCESS, {market: market});

      // supplement ch call if all required properties are present
      var requiredProperties = ["id", "traderId", "numOutcomes", "events"];
      var currentMarket = this.flux.store('market').getMarket(market.id);
      var ready = _.intersection(_.keys(currentMarket), requiredProperties);
      if (ready.length == requiredProperties.length && !supplement) {
        var commands = this.flux.actions.market.batchSupplementMarket(currentMarket);
        _.each(_.chunk(commands, 5), function(chunk) {
          ethereumClient.batch(chunk);
        });
      }

      var marketState = this.flux.store('market').getState();

      // initial markets loading
      if (marketState.loadingPage) {

        // use this progressbar for all markets
        // var totalLoaded = _.map(marketState.markets, 'loaded');
        // var percentLoaded = (_.filter(totalLoaded).length / totalLoaded.length) * 100;
        // this.flux.actions.config.updatePercentLoaded(percentLoaded);

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
    return function (property) {
      return function (value) {
        var market = { 'id': marketId };
        market[property] = value;
        self.flux.actions.market.updateMarket(market);
        return;
      };
    };
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
  },

  updateSharesHeld: function(account) {
    var self = this;
    var markets =  this.flux.store('market').getState().markets;

    // zero out trader id and shares held if no account
    if (!account) {
      _.each(markets, function (market) {
          market.traderId = null;
          _.each(market.outcomes, function (outcome) {
              outcome.sharesHeld = new BigNumber(0);
          });
          self.flux.actions.market.updateMarket(market, true);
      });

    } else {
      var ethereumClient = this.flux.store('config').getEthereumClient();

      var commands = _.map(markets, function (market) {
        var marketId = abi.prefix_hex(abi.bignum(market.id).toString(16));
        return ['getParticipantNumber', [marketId, account], function (traderId) {
          market.traderId = traderId;
          if (traderId !== -1 ) {
            _.each(market.outcomes, function (outcome) {
              ethereumClient.getParticipantSharesPurchased(
                marketId,
                market.traderId,
                outcome.id,
                function (result) {
                  outcome['sharesHeld'] = abi.unfix(result);
                }
              );
            }); 
            self.flux.actions.market.updateMarket(market, true);
          }
        }];
      });

      _.each(_.chunk(commands, 6), function (chunk) {
        ethereumClient.batch(chunk);
      });
    }
  }

};

module.exports = MarketActions;
