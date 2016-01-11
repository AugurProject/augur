"use strict";

var _ = require("lodash");
var async = require("async");
var BigNumber = require("bignumber.js");
var abi = require("augur-abi");
var augur = require("augur.js");
var constants = require("../libs/constants");
var utils = require("../libs/utilities");
var blacklist = require("../libs/blacklist");

var MarketActions = {

  loadComments: function (market) {
    var self = this;
    if (market && market.id) {
      augur.comments.getMarketComments(abi.hex(market.id), function (err, comments) {
        if (err) return console.error(err);
        if (comments && comments.constructor === Array && comments.length) {
          market.comments = comments;
          self.dispatch(constants.market.UPDATE_MARKET_SUCCESS, {market: market});
        }
      });
    }
  },

  updateComments: function (message, marketId, author) {
    var market = this.flux.store("market").getMarket(marketId);
    var comment = {
      author: author,
      blockNumber: this.flux.store('network').getState().blockNumber,
      time: Math.floor((new Date()).getTime() / 1000),
      message: message,
      ipfsHash: null
    };
    if (market.comments) {
      market.comments = [comment].concat(market.comments);
    } else {
      market.comments = [comment];
    }
    this.dispatch(constants.market.UPDATE_MARKET_SUCCESS, { market: market });
  },

  addComment: function (commentText, marketId, account) {
    var self = this;
    if (commentText && marketId) {
      var author = account.address || this.flux.store("config").getAccount();
      augur.comments.addMarketComment({
        marketId: abi.hex(marketId),
        author: author,
        message: commentText
      }, function (res) {
        self.flux.actions.market.updateComments(commentText, marketId, author);
      }, function (res) {
        // console.log("comment saved:", res);
      }, function (err) {
        console.error("addComment error:", err);
      });
    }
  },

  parseMarketInfo: function (marketInfo, callback) {
    var self = this;
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
      marketInfo.tradingPeriod = abi.bignum(marketInfo.tradingPeriod);
      if (marketInfo.participants[account]) {
        marketInfo.traderId = abi.bignum(marketInfo.participants[account]);
      }
      for (var i = 0, len = marketInfo.events.length; i < len; ++i) {
        marketInfo.events[i].endDate = utils.blockToDate(marketInfo.events[i].endDate, block);
      }
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
    var chunk = 500;
    var branchId = this.flux.store('branch').getCurrentBranch().id;

    // get data from geth via RPC
    augur.getCreationBlocks(branchId, function (creationBlock) {
      augur.getPriceHistory(branchId, function (priceHistory) {
        augur.getNumMarkets(branchId, function (numMarkets) {
          var chunks = Math.ceil(numMarkets / parseFloat(chunk));
          var range = new Array(chunks);
          for (var i = 0; i < chunks; ++i) {
            range[i] = i*chunk;
          }
          async.forEachOfSeries(range, function (offset, index, next) {
            var numMarketsToLoad = (index + 1 === chunks) ? 0 : range[index + 1];
            augur.getMarketsInfo({
              branch: branchId,
              offset: offset,
              numMarketsToLoad: numMarketsToLoad,
              combinatorial: true,
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
                      if (marketInfo && marketInfo.id) {
                        markets[marketInfo.id] = marketInfo;
                      }
                      nextMarket();
                    });
                  }, function (err) {
                    if (err) console.error(err);

                    // save markets to MarketStore
                    self.dispatch(constants.market.LOAD_MARKETS_SUCCESS, {markets: markets});

                    // loading complete!
                    self.dispatch(constants.market.MARKETS_LOADING, {loadingPage: null});
                    self.flux.actions.config.updatePercentLoaded(100 * (index + 1) / chunks);
                  });
                } else {
                  console.error("couldn't retrieve markets info:", marketsInfo);
                }
              }
            });
          });
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
            marketInfo.branchId = branchId;
            self.flux.actions.market.parseMarketInfo(marketInfo, function (parsedInfo) {
              markets[parsedInfo.id] = parsedInfo;

              // save markets to MarketStore
              self.dispatch(constants.market.LOAD_MARKETS_SUCCESS, { markets: markets });

              // loading complete!
              self.dispatch(constants.market.MARKETS_LOADING, { loadingPage: null });
              self.flux.actions.config.updatePercentLoaded(100);
            });
          } else {
            console.error("loadMarket error:", marketInfo);
          }
        });
      });
    });
  },

  batch: function (commands) {
    var batch = augur.createBatch();
    _.each(commands, function (cmd) { batch.add(cmd[0], cmd[1], cmd[2]); });
    batch.execute();
  },

  // return a skeleton market
  initMarket: function (marketId) {
    return {
      id: marketId,
      branchId: this.flux.store("branch").getCurrentBranch().id,
      loaded: false
    };
  },

  addPendingMarket: function (market) {

    // generate a (temporary) pending market ID
    market.id = "pending." + augur.utils.sha256(JSON.stringify(market));
    market.pending = true;

    this.dispatch(constants.market.ADD_PENDING_MARKET_SUCCESS, {market: market});
    return market.id;
  },

  deleteMarket: function (marketId) {
    this.dispatch(constants.market.DELETE_MARKET_SUCCESS, {marketId: marketId});
  },

  tradeSucceeded: function (tx, marketId) {
    var self = this;
    var outcomeIdx = abi.number(tx.outcome) - 1;
    this.flux.actions.asset.updateAssets();
    this.flux.actions.market.loadMarket(marketId);
  },

  updatePendingShares: function (market, outcomeId, relativeShares) {

    // relativeShares is a signed integer representing a trade (buy/sell)
    if (market && outcomeId && relativeShares) {

      var pendingShares = market.outcomes[outcomeId-1].pendingShares.toNumber() + parseFloat(relativeShares);
      market.outcomes[outcomeId-1].pendingShares = abi.bignum(pendingShares);

      this.dispatch(constants.market.UPDATE_MARKET_SUCCESS, {market: market});
    }
  }

};

module.exports = MarketActions;
