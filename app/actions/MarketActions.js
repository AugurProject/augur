var _ = require('lodash');
var async = require('async');
var abi = require('augur-abi');
var constants = require('../libs/constants');
var utils = require('../libs/utilities');
var blacklist = require('../libs/blacklist');

var MarketActions = {

  loadComments: function (market) {
    var self = this;
    if (market && market.id) {
      augur.comments.getMarketComments(abi.hex(market.id), function (comments) {
        if (comments && comments.constructor === Array && comments.length) {
          market.comments = comments;
          self.dispatch(constants.market.UPDATE_MARKET_SUCCESS, { market: market });
        }
      });
    }
  },

  updateComments: function (comments, marketId) {
    var market = this.flux.store("market").getMarket(marketId);
    market.comments = comments;
    this.dispatch(constants.market.UPDATE_MARKET_SUCCESS, { market: market });
  },

  addComment: function (commentText, marketId, account) {
    if (commentText && marketId) {
      var updatedComments = augur.comments.addMarketComment({
        marketId: abi.hex(marketId),
        author: account.address || this.flux.store("config").getAccount(),
        message: commentText
      });
      this.flux.actions.market.updateComments(updatedComments, marketId);
    }
  },

  parseMarketInfo: function (marketInfo, callback) {
    var marketId = abi.bignum(marketInfo._id);
    var block = self.flux.store('network').getState().blockNumber;
    var account = self.flux.store('config').getAccount();
    var branchId = self.flux.store('branch').getCurrentBranch().id;
    var blackmarkets = blacklist.markets[augur.network_id][branchId];
    if (marketInfo && abi.bignum(marketInfo.branchId).eq(abi.bignum(branchId)) &&
        !_.contains(blackmarkets, marketId.toString(16)) &&
        !marketInfo.invalid && marketInfo.price && marketInfo.description) {
      marketInfo.id = marketId;
      marketInfo.endDate = utils.blockToDate(marketInfo.endDate, block);
      if (marketInfo.creationBlock) {
        marketInfo.creationDate = utils.blockToDate(marketInfo.creationBlock, block);
      }
      marketInfo.price = abi.bignum(marketInfo.price);
      marketInfo.tradingFee = abi.bignum(marketInfo.tradingFee);
      marketInfo.creationFee = abi.bignum(marketInfo.creationFee);
      marketInfo.traderCount = abi.bignum(marketInfo.traderCount);
      marketInfo.alpha = abi.bignum(marketInfo.alpha);
      marketInfo.numOutcomes = parseInt(marketInfo.numOutcomes);
      marketInfo.tradingPeriod = abi.bignum(marketInfo.tradingPeriod);
      marketInfo.traderId = abi.bignum(marketInfo.participants[account]);
      if (marketInfo.outcomes && marketInfo.outcomes.length) {
        async.each(marketInfo.outcomes, function (thisOutcome, nextOutcome) {
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
          thisOutcome.pendingShares = abi.bignum(0);
          thisOutcome.price = abi.bignum(thisOutcome.price);
          nextOutcome();
        }, function (err) {
          if (err) console.error(err);
          marketInfo.loaded = true;
          callback(marketInfo);
        });
      } else {
        callback();
      }
    } else {
      callback();
    }
  },

  loadMarkets: function () {
    var self = this;
    var branchId = this.flux.store('branch').getCurrentBranch().id;

    // get data from geth via RPC
    augur.getCreationBlocks(branchId, function (creationBlock) {
      augur.getPriceHistory(branchId, function (priceHistory) {
        // TODO: use offset/numMarketsToLoad to load 1 page at a time
        augur.getMarketsInfo({
          branch: branchId,
          offset: 0,
          numMarketsToLoad: 0,
          callback: function (marketsInfo) {
            if (marketsInfo && !marketsInfo.error) {
              var blackmarkets = blacklist.markets[augur.network_id][branchId];
              var markets = {};
              async.eachSeries(marketsInfo, function (thisMarket, nextMarket) {
                if (creationBlock && creationBlock[thisMarket._id]) {
                  thisMarket.creationBlock = creationBlock[thisMarket._id];
                }
                if (priceHistory && priceHistory[thisMarket._id]) {
                  thisMarket.priceHistory = priceHistory[thisMarket._id];
                }
                self.flux.actions.market.parseMarketInfo(thisMarket, function (marketInfo) {
                  markets[marketInfo.id] = marketInfo;
                  nextMarket();
                });
              }, function (err) {
                if (err) console.error(err);

                // save markets to MarketStore
                self.dispatch(constants.market.LOAD_MARKETS_SUCCESS, { markets: markets });

                // loading complete!
                self.dispatch(constants.market.MARKETS_LOADING, { loadingPage: null });
                self.flux.actions.config.updatePercentLoaded(100);
              });
            } else {
              console.error("couldn't retrieve markets info", marketsInfo);
            }
          }
        });
      });
    });
  },

  loadMarket: function (marketId) {  
    var self = this;
    var branchId = this.flux.store('branch').getCurrentBranch().id;
    marketId = abi.hex(marketId);
    augur.getMarketCreationBlock(marketId, function (creationBlock) {
      augur.getMarketPriceHistory(marketId, function (priceHistory) {
        augur.getMarketInfo(marketId, function (marketInfo) {
          if (marketInfo && !marketInfo.error) {
            var markets = self.flux.store('market').getState().markets;
            if (creationBlock) marketInfo.creationBlock = creationBlock;
            if (priceHistory) marketInfo.priceHistory = priceHistory;
            self.flux.actions.market.parseMarketInfo(marketInfo, function (parsedInfo) {
              markets[parsedInfo.id] = parsedInfo;

              // save markets to MarketStore
              self.dispatch(constants.market.LOAD_MARKETS_SUCCESS, { markets: markets });

              // loading complete!
              self.dispatch(constants.market.MARKETS_LOADING, { loadingPage: null });
              self.flux.actions.config.updatePercentLoaded(100);
            });
          } else {
            console.error(marketInfo);
          }
        });
      });
    });
  },

  loadSomeMarkets: function (marketIds) {
    var self = this;
    var markets =  this.flux.store('market').getState().markets;

    _.each(marketIds, function (marketId) {

      // initialize market if it doesn't exist
      if (!markets[marketId]) {
        var market = self.flux.actions.market.initMarket(marketId);
        self.dispatch(constants.market.ADD_MARKET_SUCCESS, { market: market });
      }

      var commands = self.flux.actions.market.batchMarket(marketId);
      _.each(_.chunk(commands, 5), function (chunk) {
          self.flux.actions.market.batch(chunk);
      });
    });
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
            sharesHeld: new BigNumber(0),
            pendingShares: new BigNumber(0)
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

  batch: function (commands) {
    var batch = augur.createBatch();
    _.each(commands, function (cmd) { batch.add(cmd[0], cmd[1], cmd[2]); });
    batch.execute();
  },

  updateMarket: function (market, supplement) {
    var self = this;
    if (market && market.id && market.id !== "0x") {

      var marketId = abi.hex(market.id);

      // Calculate market properties before dispatch (seems to belong in a Market class)
      if (!market.outstandingShares && market.outstandingShares !== 0) {
        market.outstandingShares = _.reduce(market.outcomes, function(outstandingShares, outcome) {
          if (outcome) return outstandingShares + abi.number(outcome.outstandingShares);
        }, 0);
      }

      this.dispatch(constants.market.UPDATE_MARKET_SUCCESS, {market: market});

      // supplement ch call if all required properties are present
      var requiredProperties = ["id", "traderId", "numOutcomes", "events"];
      var currentMarket = this.flux.store('market').getMarket(market.id);
      var ready = _.intersection(_.keys(currentMarket), requiredProperties);
      if (ready.length == requiredProperties.length && !supplement) {
        var commands = this.flux.actions.market.batchSupplementMarket(currentMarket);
        _.each(_.chunk(commands, 5), function (chunk) {
          self.flux.actions.market.batch(chunk);
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

  tradeSucceeded: function (tx) {
    var self = this;
    var outcomeIdx = abi.number(tx.outcome) - 1;
    this.flux.actions.asset.updateAssets();
    this.flux.actions.market.loadMarket(marketId);
  },

  updatePendingShares: function(market, outcomeId, relativeShares) {

    // relativeShares is a signed integer representing a trade (buy/sell)
    if (market && outcomeId && relativeShares) {

      var pendingShares = market.outcomes[outcomeId-1].pendingShares.toNumber() + parseFloat(relativeShares);
      market.outcomes[outcomeId-1].pendingShares = abi.bignum(pendingShares);

      this.dispatch(constants.market.UPDATE_MARKET_SUCCESS, {market: market});
    }
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
      var commands = _.map(markets, function (market) {
        var marketId = abi.hex(market.id);
        return ['getParticipantNumber', [marketId, account], function (traderId) {
          market.traderId = abi.bignum(traderId);
          if (traderId !== -1) {
            _.each(market.outcomes, function (outcome) {
              augur.getParticipantSharesPurchased(marketId, traderId, outcome.id, function (r) {
                outcome['sharesHeld'] = abi.unfix(r.callReturn);
              });
            });
            self.flux.actions.market.updateMarket(market, true);
          }
        }];
      });
      _.each(_.chunk(commands, 6), function (chunk) {
        self.flux.actions.market.batch(chunk);
      });
    }
  }

};

module.exports = MarketActions;
