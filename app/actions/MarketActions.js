"use strict";

var _ = require("lodash");
var async = require("async");
var clone = require("clone");
var BigNumber = require("bignumber.js");
var abi = require("augur-abi");
var constants = require("../libs/constants");
var utils = require("../libs/utilities");
var blacklist = require("../libs/blacklist");

module.exports = {

  loadComments: function (market, options) {
    var self = this;
    options = options || {};
    if (market && market.id) {
      this.flux.augur.ramble.getMarketComments(abi.hex(market.id), options, function (err, comments) {
        if (err) return console.error(err);
        if (comments && comments.constructor === Array && comments.length) {
          market.comments = comments;
          self.dispatch(constants.market.UPDATE_MARKET_SUCCESS, {market: market});
        }
      });
    }
  },

  updateComments: function (message, marketId, author) {
    var market = clone(this.flux.store("market").getMarket(marketId));
    if (!market || market.constructor !== Object) {
      return console.error("MarketActions.updateComments: market not found");
    }
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
    this.dispatch(constants.market.UPDATE_MARKET_SUCCESS, {market: market});
  },

  addComment: function (commentText, marketId, account) {
    var self = this;
    if (commentText && marketId) {
      var author = account.address || this.flux.store("config").getAccount();
      this.flux.augur.ramble.addMarketComment({
        marketId: abi.hex(marketId),
        author: author,
        message: commentText,
        broadcast: true
      }, function (res) {
        self.flux.actions.market.updateComments(commentText, marketId, author);
      }, function (res) {
        self.dispatch(constants.market.COMMENT_SAVED, {});
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
    var blackmarkets = blacklist.markets[this.flux.augur.network_id][branchId];
    if (marketInfo && abi.bignum(marketInfo.branchId).eq(abi.bignum(branchId)) &&
        !_.contains(blackmarkets, marketId.toString(16)) &&
        !marketInfo.invalid && marketInfo.price && marketInfo.description) {
      marketInfo.id = marketId;
      marketInfo.endBlock = marketInfo.endDate;
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
    var augur = this.flux.augur;
    var marketsPerPage = this.flux.store('market').getMarketsPerPage();
    var branchId = this.flux.store('branch').getCurrentBranch().id;
    var account = this.flux.store('config').getAccount();

    // request data from geth via JSON RPC
    var start = (new Date()).getTime();
    var prevTime = start;
    augur.getCreationBlocks(branchId, function (creationBlock) {
      augur.getNumMarketsBranch(branchId, function (numMarkets) {
        numMarkets = parseInt(numMarkets);
        var numPages = Math.ceil(numMarkets / Number(marketsPerPage));
        var range = new Array(numPages);
        for (var i = 0; i < numPages; ++i) {
          range[i] = i*marketsPerPage;
        }
        var markets = {};
        async.forEachOfSeries(range, function (offset, index, next) {
          var numMarketsToLoad = (index+1 === numPages) ? numMarkets - range[index] : marketsPerPage;
          augur.getMarketsInfo({
            branch: branchId,
            offset: offset,
            numMarketsToLoad: numMarketsToLoad,
            callback: function (marketsInfo) {
              if (marketsInfo && !marketsInfo.error) {
                var blackmarkets = blacklist.markets[augur.network_id][branchId];
                async.each(marketsInfo, function (thisMarket, nextMarket) {
                  if (creationBlock && creationBlock[thisMarket._id]) {
                    thisMarket.creationBlock = creationBlock[thisMarket._id];
                  }
                  self.flux.actions.market.parseMarketInfo(thisMarket, function (marketInfo) {
                    if (marketInfo && marketInfo.id) {
                      markets[marketInfo.id] = marketInfo;
                    }
                    nextMarket();
                  });
                }, function (err) {
                  if (err) return next(err);
                  console.debug("page", index, "loaded in", ((new Date()).getTime() - prevTime) / 1000, "seconds");
                  prevTime = (new Date()).getTime();

                  // save markets to MarketStore
                  var percentLoaded = 100 * (index + 1) / numPages;
                  self.dispatch(constants.market.LOAD_MARKETS_SUCCESS, {
                    markets: markets,
                    percentLoaded: percentLoaded,
                    account: account
                  });
                  self.flux.actions.config.updatePercentLoaded(percentLoaded);

                  self.dispatch(constants.market.MARKETS_LOADING, {loadingPage: null});

                  // fetch next page of markets
                  next();
                });
              } else {
                console.error("couldn't retrieve markets info:", marketsInfo);
              }
            }
          });
        }, function (err) {
          if (err) return console.error("loadMarkets:", err);

          // async.each(markets, function (thisMarket, nextMarket) {
          //   console.log("load metadata for:", thisMarket._id);
          //   self.flux.actions.market.loadMetadata(thisMarket);
          //   nextMarket();
          // }, function (err) {
          //   if (err) console.error("metadata error:", err);
          // });

          // loading complete!
          console.debug("all markets loaded in", ((new Date()).getTime() - start) / 1000, "seconds");
        });
      });
    });
  },

  loadMarket: function (marketId) {  
    var self = this;
    var augur = this.flux.augur;
    var branchId = this.flux.store('branch').getCurrentBranch().id;
    var account = this.flux.store('config').getAccount();
    marketId = abi.hex(marketId);
    augur.getMarketCreationBlock(marketId, function (creationBlock) {
      augur.getMarketPriceHistory(marketId, function (priceHistory) {
        augur.getMarketInfo(marketId, function (marketInfo) {
          if (!marketInfo || marketInfo.error || !marketInfo.network) {
            return console.error("loadMarket:", marketInfo);
          }
          var markets = self.flux.store('market').getState().markets;
          if (creationBlock) marketInfo.creationBlock = creationBlock;
          if (priceHistory) marketInfo.priceHistory = priceHistory;
          marketInfo.branchId = branchId;
          self.flux.actions.market.parseMarketInfo(marketInfo, function (parsedInfo) {
            markets[parsedInfo.id] = parsedInfo;

            // save markets to MarketStore
            self.dispatch(constants.market.LOAD_MARKETS_SUCCESS, {
              markets: markets,
              account: account
            });

            // loading complete!
            self.dispatch(constants.market.MARKETS_LOADING, {loadingPage: null});
            self.flux.actions.config.updatePercentLoaded(100);
          });
        });
      });
    });
  },

  loadMetadata: function (market) {
    var self = this;
    console.log("loading:", market._id);
    this.flux.augur.ramble.getMarketMetadata(market._id, null, function (err, metadata) {
      console.info(market._id, "metadata loaded:", metadata);
      if (!err && metadata) {
        self.dispatch(constants.market.LOAD_METADATA_SUCCESS, {metadata});
      }
    });
  },

  checkOrderBook: function (market) {
    var self = this;
    this.flux.augur.checkOrderBook(market, function (matchedOrders) {
      self.dispatch(constants.market.CHECK_ORDER_BOOK_SUCCESS, {matchedOrders});
    });
  },

  loadPriceHistory: function (market) {
    var self = this;
    if (!this.flux.store("market").getPriceHistoryStatus(market.id)) {
      this.dispatch(constants.market.PRICE_HISTORY_LOADING, {marketId: market.id});
      this.flux.augur.getMarketPriceHistory(market._id, function (priceHistory) {
        if (priceHistory) {
          if (priceHistory.error) {
            return console.error("loadPriceHistory:", priceHistory);
          }
          self.dispatch(constants.market.LOAD_PRICE_HISTORY_SUCCESS, {market, priceHistory});
        }
      });
    }
  },

  batch: function (commands) {
    var batch = this.flux.augur.createBatch();
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
    market.id = "pending." + this.flux.augur.utils.sha256(JSON.stringify(market));
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

  // relativeShares is a signed integer representing a trade (buy/sell)
  updatePendingShares: function (market, outcomeId, relativeShares) {
    if (market && outcomeId && relativeShares) {
      market.outcomes[outcomeId-1].pendingShares = market.outcomes[outcomeId - 1].pendingShares.plus(abi.bignum(relativeShares));
      this.dispatch(constants.market.UPDATE_MARKET_SUCCESS, {market: market});
    }
  },

  loadOrders: function () {
    var account = this.flux.store('config').getAccount();
    if (account) {
      var orders = this.flux.augur.orders.get(account);
      this.dispatch(constants.market.LOAD_ORDERS_SUCCESS, {orders});
    }
  },

  updateOrders: function (orders) {
    if (orders) {
      this.dispatch(constants.market.UPDATE_ORDERS_SUCCESS, {orders});
    }
  }

};
