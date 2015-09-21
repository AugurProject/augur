var _ = require('lodash');
var async = require('async');
var abi = require('augur-abi');
var constants = require('../libs/constants');
var utils = require('../libs/utilities');
var blacklist = require('../libs/blacklist');

var MarketActions = {

  clear: function (pulse, xhr) {
    if (pulse) clearTimeout(pulse);
    if (xhr) xhr.abort();
  },

  nextNode: function (got, pulse, xhr, startNode) {
    this.flux.actions.market.clear(pulse, xhr);
    utils.rotate(constants.MARKET_CACHE);
    if (!got && constants.MARKET_CACHE[0] !== startNode) {
      this.flux.actions.market.loadMarketCache(got, pulse, xhr, startNode);
    }
  },

  parseCache: function (cached) {
    var self = this;
    var block = self.flux.store('network').getState().blockNumber;
    var account = self.flux.store('config').getAccount();
    var branchId = self.flux.store('branch').getCurrentBranch().id;
    var blackmarkets = blacklist.markets[augur.network_id][branchId];
    var markets = {};
    async.each(cached, function (thisMarket, nextMarket) {
      var marketId = abi.bignum(thisMarket._id);
      if (abi.bignum(thisMarket.branchId).eq(abi.bignum(branchId)) &&
          !_.contains(blackmarkets, marketId.toString(16)) &&
          !thisMarket.invalid && thisMarket.price && thisMarket.description) {
        thisMarket.id = marketId;
        thisMarket.endDate = utils.blockToDate(thisMarket.endDate, block);
        if (thisMarket.creationBlock) {
          thisMarket.creationDate = utils.blockToDate(thisMarket.creationBlock, block);
        }
        thisMarket.price = abi.bignum(thisMarket.price);
        thisMarket.tradingFee = abi.bignum(thisMarket.tradingFee);
        thisMarket.creationFee = abi.bignum(thisMarket.creationFee);
        thisMarket.traderCount = abi.bignum(thisMarket.traderCount);
        thisMarket.alpha = abi.bignum(thisMarket.alpha);
        thisMarket.numOutcomes = parseInt(thisMarket.numOutcomes);
        thisMarket.tradingPeriod = abi.bignum(thisMarket.tradingPeriod);
        thisMarket.traderId = abi.bignum(thisMarket.participants[account]);
        if (thisMarket.outcomes && thisMarket.outcomes.length) {
          async.each(thisMarket.outcomes, function (thisOutcome, nextOutcome) {
            if (thisOutcome.outstandingShares) {
              thisOutcome.outstandingShares = abi.bignum(thisOutcome.outstandingShares);
            } else {
              thisOutcome.outstandingShares = abi.bignum(0);
            }
            if (thisOutcome.shares[account]) {
              thisOutcome.sharesHeld = abi.bignum(thisOutcome.shares[account]);
            } else {
              thisOutcome.sharesHeld = abi.bignum(0);
            }
            thisOutcome.price = abi.bignum(thisOutcome.price);
            nextOutcome();
          }, function (err) {
            if (err) console.error(err);
            thisMarket.loaded = true;
            markets[marketId] = thisMarket;
            nextMarket();
          });
        } else {
          nextMarket();
        }
      } else {
        nextMarket();
      }
    }, function (err) {
      if (err) console.error(err);

      // save markets to MarketStore
      self.dispatch(constants.market.LOAD_MARKETS_SUCCESS, { markets: markets });

      // loading complete!
      self.flux.actions.config.updatePercentLoaded(100);
    });
  },

  loadMarketCache: function (got, pulse, xhr, startNode) {
    var self = this;
    startNode = startNode || constants.MARKET_CACHE[0];
    if (got) return self.flux.actions.market.clear(pulse, xhr);

    // fetch markets from mongodb via HTTP GET request
    xhr = $.get(constants.MARKET_CACHE[0], function (cached) {
      if (!cached) return self.flux.actions.market.nextNode(got, pulse, xhr, startNode);
      cached = JSON.parse(cached).rows;
      if (!cached || cached.constructor !== Array || !cached.length) {
        return self.flux.actions.market.nextNode(got, pulse, xhr, startNode);
      }
      if (pulse) clearTimeout(pulse);
      got = true;
      self.dispatch(constants.market.MARKETS_LOADING, { loadingPage: 1 });
      self.dispatch(constants.market.GOT_CACHED_MARKETS, { cachedMarkets: cached });
      self.flux.actions.config.updatePercentLoaded(20);
      setTimeout(function () { self.flux.actions.market.parseCache(cached); }, 0);
    });

    // after a delay, rotate cache nodes and try again
    if (pulse) clearTimeout(pulse);
    pulse = setTimeout(function () {
      self.flux.actions.market.nextNode(got, pulse, xhr, startNode);
    }, constants.CACHE_PULSE);
  },

  loadMarkets: function () {
    var self = this;
    var firstPage = 1;
    var branchId = this.flux.store('branch').getCurrentBranch().id;

    // if we're on a hosted node, load preprocessed market data
    if (this.flux.store('config').getState().useMarketCache) {
      return this.flux.actions.market.loadMarketCache();
    }

    // if we're on a local node, get data directly from geth via RPC
    augur.getMarkets(branchId, function (marketIds) {
      if (!marketIds || marketIds.error) {
        return self.flux.actions.config.updatePercentLoaded(100);
      }
      marketIds = abi.bignum(_.filter(marketIds, function (marketId) {
        return !_.contains(
          blacklist.markets[augur.network_id][branchId],
          abi.strip_0x(marketId)
        );
      }, self));

      // initialize all markets
      var markets = {};
      _.each(marketIds, function (id) {
        markets[id] = self.flux.actions.market.initMarket(id);
      }, self);

      self.dispatch(constants.market.LOAD_MARKETS_SUCCESS, {
        markets: markets
      });

      // breaks ids into pages
      // load one page at a time
      var marketPageIds = _.chunk(marketIds, constants.MARKETS_PER_PAGE);

      // setup page loading
      self.dispatch(constants.market.MARKETS_LOADING, {
        marketLoadingIds: marketPageIds,
        loadingPage: firstPage
      });

      // load initial markets
      self.flux.actions.market.loadSomeMarkets(marketPageIds[firstPage-1]);

      // short circuit loading if no markets
      if (!_.keys(marketIds).length) {
        self.flux.actions.config.updatePercentLoaded(100);
      }
    });
  },

  loadNewMarkets: function () {

    var branchId = this.flux.store('branch').getCurrentBranch().id;
    var ethereumClient = this.flux.store('config').getEthereumClient();
    var currentMarkets = this.flux.store('market').getState().markets;
    var currentMarketIds = _.map(_.reject(currentMarkets, function (market) {
      return typeof(market.id) === 'string' && market.id.match(/pending/);
    }), 'id');

    augur.getMarkets(branchId, function (markets) {
      if (markets && !markets.error) {
        var newMarketIds, validMarkets;
        validMarkets = _.filter(markets, function (marketId) {
          return !_.contains(
            blacklist.markets[augur.network_id][branchId],
            abi.strip_0x(marketId)
          );
        }, self);
        if (currentMarkets) {
          newMarketIds = _.difference(validMarkets, currentMarkets);
        } else {
          newMarketIds = validMarkets;
        }
        if (newMarketIds && newMarketIds.length) {
          self.flux.actions.market.loadSomeMarkets(abi.bignum(newMarketIds));
        }
      }
    });
  },

  loadMarket: function (marketId) {  
    this.flux.actions.market.loadSomeMarkets([marketId]);
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

      //console.log('loading', marketId.toString(16));
      var commands = this.flux.actions.market.batchMarket(marketId);
      _.each(_.chunk(commands, 5), function(chunk) {
          ethereumClient.batch(chunk);
      });
    }, this);
  },

  // first batch of data fetch from market
  batchMarket: function (marketId) {
    var self = this;
    var account = this.flux.store('config').getAccount();
    var market = { id: marketId, outcomes: [], comments: [] };
    var commands = [];

    marketId = abi.hex(marketId);

    commands.push(['getCreationFee', [marketId], function (creationFee) {
      self.flux.actions.market.updateMarket({
        id: marketId,
        creationFee: abi.bignum(creationFee)
      });
    }]);
    commands.push(['getDescription', [marketId], function (description) {
      self.flux.actions.market.updateMarket({
        id: marketId,
        description: description
      });
    }]);
    commands.push(['getCreator', [marketId], function (author) {
      self.flux.actions.market.updateMarket({
        id: marketId,
        author: abi.bignum(author)
      });
    }]);
    commands.push(['getMarketEvents', [marketId], function (events) {
      self.flux.actions.market.updateMarket({
        id: marketId,
        events: abi.bignum(events)
      });
    }]);
    commands.push(['getParticipantNumber', [marketId, account], function (traderId) {
      self.flux.actions.market.updateMarket({
        id: marketId,
        traderId: abi.bignum(traderId)
      });
    }]);
    commands.push(['getMarketInfo', [marketId], function (result) {
      if (result && !result.error) {
        result = abi.bignum(result);

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
      }
    }]);

    return commands;
  },

  // second, supplement batch of data fetched after above prereqs are acquired
  batchSupplementMarket: function (market) {

    var self = this;
    var commands = [];
    var account = this.flux.store('config').getAccount();
    var marketId = abi.hex(market.id);

    // populate outcome data
    _.each(market.outcomes, function (outcome) {
      if (market.traderId !== -1 ) {
        commands.push([
          'getParticipantSharesPurchased',
          [marketId, abi.prefix_hex(market.traderId), outcome.id],
          function (sharesHeld) {
            if (sharesHeld && !sharesHeld.error) {
              outcome['sharesHeld'] = abi.unfix(sharesHeld, "BigNumber");
              self.flux.actions.market.updateMarket(market, true);
            }
          }
        ]);
      }
      commands.push(['getMarketOutcomeInfo', [marketId, outcome.id], function (marketOutcomeInfo) {
        if (marketOutcomeInfo && !marketOutcomeInfo.error && marketOutcomeInfo.length) {
          outcome['outstandingShares'] = abi.unfix(marketOutcomeInfo[0], "BigNumber");
          if (market.traderId && market.traderId.toNumber() !== -1) {
            outcome['sharesHeld'] = abi.unfix(marketOutcomeInfo[1], "BigNumber");
          }
          outcome['price'] = abi.unfix(marketOutcomeInfo[2], "BigNumber");
          if (outcome.id === 2) market['price'] = outcome['price'];  // hardcoded to outcome 2 (yes)
          market['traderCount'] = abi.bignum(marketOutcomeInfo[4]);
          self.flux.actions.market.updateMarket(market, true);
        }
      }]);
    }, this);

    if (market.events.length) {

      var marketEvent = abi.hex(market.events[0]);

      commands.push(['getExpiration', [marketEvent], function (expiration) {
        if (expiration && !expiration.error) {

          // calc end date from first event expiration
          market['endDate'] = utils.blockToDate(abi.number(expiration));

          // TODO each of these should not trigger an update
          self.flux.actions.market.updateMarket(market, true);
        }
      }]);

      commands.push(['getWinningOutcomes', [marketId], function (winningOutcomes) {
        if (winningOutcomes && winningOutcomes.length) {
          market['winningOutcomes'] = winningOutcomes.slice(0, market.events.length);

          // TODO each of these should not trigger an update
          self.flux.actions.market.updateMarket(market, true);
        }
      }]);

      commands.push(['getOutcome', [marketEvent], function (outcome) {

        // TODO there will need to be an outcome for each event
        market['eventOutcome'] = abi.string(outcome);

        // TODO each of these should not trigger an update
        self.flux.actions.market.updateMarket(market, true);
      }]);

    } else {

      market['invalid'] = true
    }

    return commands;
  },

  updateMarket: function (market, supplement) {

    if (market && market.id && market.id !== "0x") {

      var marketId = abi.hex(market.id);

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

  // return a skeleton market
  initMarket: function (marketId) {
    return {
      id: marketId,
      branchId: this.flux.store('branch').getCurrentBranch().id,
      loaded: false
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
        var marketId = abi.hex(market.id);
        return ['getParticipantNumber', [marketId, account], function (traderId) {
          market.traderId = abi.bignum(traderId);
          if (traderId !== -1) {
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
