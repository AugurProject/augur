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
    var block = this.flux.store('network').getState().blockNumber;
    var account = this.flux.store('config').getAccount();
    var branchId = this.flux.store('branch').getCurrentBranch().id;
    var blackmarkets = blacklist.markets[this.flux.augur.network_id][branchId];
    callback = callback || this.flux.augur.utils.pass;
    if (marketInfo && marketInfo.branchId &&
        abi.bignum(marketInfo.branchId).eq(abi.bignum(branchId)) &&
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
      marketInfo.longDescription = marketInfo.description;
      if (marketInfo.type === "categorical") {
        marketInfo.description = marketInfo.description.slice(0, marketInfo.description.indexOf("Choices:"));
      }
      if (marketInfo.participants[account]) {
        marketInfo.traderId = abi.bignum(marketInfo.participants[account]);
      }
      for (var i = 0, len = marketInfo.events.length; i < len; ++i) {
        marketInfo.events[i].endDate = utils.blockToDate(marketInfo.events[i].endDate, block);
      }
      if (marketInfo.outcomes && marketInfo.outcomes.length) {
        var totalPrice = new BigNumber(0);
        var numOutcomes = marketInfo.numOutcomes;
        for (i = 0; i < numOutcomes; ++i) {
          marketInfo.outcomes[i].price = abi.bignum(marketInfo.outcomes[i].price);
          totalPrice = totalPrice.plus(marketInfo.outcomes[i].price);
        }
        for (i = 0; i < numOutcomes; ++i) {
          if (marketInfo.outcomes[i].outstandingShares) {
            marketInfo.outcomes[i].outstandingShares = abi.bignum(marketInfo.outcomes[i].outstandingShares);
          } else {
            marketInfo.outcomes[i].outstandingShares = new BigNumber(0);
          }
          if (marketInfo.outcomes[i].shares[account]) {
            marketInfo.outcomes[i].sharesHeld = abi.bignum(marketInfo.outcomes[i].shares[account]);
          } else {
            marketInfo.outcomes[i].sharesHeld = new BigNumber(0);
          }
          marketInfo.outcomes[i].normalizedPrice = marketInfo.outcomes[i].price.dividedBy(totalPrice);
          marketInfo.outcomes[i].pendingShares = new BigNumber(0);
          marketInfo.outcomes[i].label = utils.getOutcomeName(marketInfo.outcomes[i].id, marketInfo).outcome;
        }
        marketInfo.outcomes.sort(function (a, b) {
          return b.price.minus(a.price);
        });
        marketInfo.loaded = true;
        return callback(marketInfo);
      }
      return callback();
    }
    return callback();
  },

  calculatePnl: function (market) {
    var account = this.flux.store("config").getAccount();
    var totalIn = new BigNumber(0);
    var totalOut = new BigNumber(0);
    var totalUnsold = new BigNumber(0);
    var cost, shares, unsoldShares, unsoldValue;
    for (var outcome in market.trades) {
      if (!market.trades.hasOwnProperty(outcome)) continue;
      unsoldShares = null;
      for (var j = 0; j < market.outcomes.length; ++j) {
        if (market.outcomes[j].id.toString() === outcome) {
          unsoldShares = market.outcomes[j].shares[account];
          break;
        }
      }
      for (var i = 0; i < market.trades[outcome].length; ++i) {
        cost = abi.bignum(market.trades[outcome][i].cost);
        shares = abi.bignum(market.trades[outcome][i].shares);
        if (cost.lt(new BigNumber(0))) {
          totalIn = totalIn.plus(cost.times(shares).abs());
        } else {
          totalOut = totalOut.plus(cost.times(shares).abs());
        }
      }
      if (unsoldShares) {
        unsoldValue = abi.bignum(this.flux.augur.getSimulatedSell(market, outcome, unsoldShares)[0]);
        totalUnsold = totalUnsold.plus(unsoldValue);
      }
    }
    if (!totalIn.eq(new BigNumber(0))) {
      market.pnl = totalOut.minus(totalIn).dividedBy(totalIn).times(new BigNumber(100)).toFixed(2);
      market.unrealizedPnl = totalOut.plus(totalUnsold).minus(totalIn).dividedBy(totalIn).times(new BigNumber(100)).toFixed(2);
    } else {
      market.pnl = "0.00";
      market.unrealizedPnl = "0.00";
    }
    return market;
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

        // load delicious extras
        augur.getAccountTrades(account, function (trades) {
          var thisMarket;
          for (var id in markets) {
            if (!markets.hasOwnProperty(id)) continue;
            thisMarket = markets[id];
            var unforkedMarketId = abi.unfork(thisMarket._id, true);
            if (trades && trades[unforkedMarketId]) {
              thisMarket.trades = trades[unforkedMarketId];
              thisMarket = self.flux.actions.market.calculatePnl(thisMarket);
            } else {
              thisMarket.trades = null;
            }
          }
          console.debug(
            "all markets + trades loaded in",
            ((new Date()).getTime() - start) / 1000, "seconds"
          );
          self.dispatch(constants.market.LOAD_MARKETS_SUCCESS, {
            markets: markets,
            percentLoaded: 100,
            account: account
          });
          augur.getCreationBlocks(branchId, function (creationBlock) {
            for (var id in markets) {
              if (!markets.hasOwnProperty(id)) continue;
              if (creationBlock && creationBlock[markets[id]._id]) {
                markets[id].creationBlock = creationBlock[markets[id]._id];
              }
            }
            console.debug(
              "all markets + logs loaded in",
              ((new Date()).getTime() - start) / 1000, "seconds"
            );
            self.dispatch(constants.market.LOAD_MARKETS_SUCCESS, {
              markets: markets,
              percentLoaded: 100,
              account: account
            });
            async.eachSeries(markets, function (thisMarket, nextMarket) {
              self.flux.actions.market.loadMetadata(thisMarket, nextMarket);
            }, function (err) {
              if (err) console.error("metadata error:", err);
              console.debug(
                "all markets + metadata + logs loaded in",
                ((new Date()).getTime() - start) / 1000, "seconds"
              );
              self.dispatch(constants.market.INITIAL_LOAD_COMPLETE);
            });
          });
        });

        // loading complete!
        console.debug("all markets loaded in", ((new Date()).getTime() - start) / 1000, "seconds");
      });
    });
  },

  loadMarket: function (marketId, callback) {
    var self = this;
    var augur = this.flux.augur;
    var branchId = this.flux.store('branch').getCurrentBranch().id;
    var account = this.flux.store('config').getAccount();
    callback = callback || function () {};
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
            self.flux.actions.market.loadMetadata(marketInfo);
            callback(parsedInfo);
          });
        });
      });
    });
  },

  updatePrice: function (marketId, callback) {
    var self = this;
    var account = this.flux.store("config").getAccount();
    callback = callback || function () {};
    console.log("marketId:", abi.hex(marketId));
    this.flux.augur.getMarketInfo(abi.hex(marketId), function (marketInfo) {
      if (!marketInfo || marketInfo.error || !marketInfo.network) {
        return console.error("updatePrice:", marketInfo);
      }
      var markets = self.flux.store("market").getState().markets;
      if (marketInfo.outcomes && marketInfo.outcomes.length) {
        var totalPrice = new BigNumber(0);
        var numOutcomes = marketInfo.numOutcomes;
        for (var i = 0; i < numOutcomes; ++i) {
          marketInfo.outcomes[i].price = abi.bignum(marketInfo.outcomes[i].price);
          totalPrice = totalPrice.plus(marketInfo.outcomes[i].price);
        }
        for (i = 0; i < numOutcomes; ++i) {
          if (marketInfo.outcomes[i].outstandingShares) {
            marketInfo.outcomes[i].outstandingShares = abi.bignum(marketInfo.outcomes[i].outstandingShares);
          } else {
            marketInfo.outcomes[i].outstandingShares = new BigNumber(0);
          }
          if (marketInfo.outcomes[i].shares[account]) {
            marketInfo.outcomes[i].sharesHeld = abi.bignum(marketInfo.outcomes[i].shares[account]);
          } else {
            marketInfo.outcomes[i].sharesHeld = new BigNumber(0);
          }
          marketInfo.outcomes[i].normalizedPrice = marketInfo.outcomes[i].price.dividedBy(totalPrice);
          marketInfo.outcomes[i].pendingShares = new BigNumber(0);
          marketInfo.outcomes[i].label = utils.getOutcomeName(marketInfo.outcomes[i].id, marketInfo).outcome;
        }
        marketInfo.outcomes.sort(function (a, b) {
          return b.price.minus(a.price);
        });
        markets[marketId] = marketInfo.outcomes;

        // save markets to MarketStore
        self.dispatch(constants.market.LOAD_MARKETS_SUCCESS, {
          markets: markets,
          account: account
        });

        // loading complete!
        self.dispatch(constants.market.MARKETS_LOADING, {loadingPage: null});
        self.flux.actions.config.updatePercentLoaded(100);
        self.flux.actions.market.loadMetadata(marketInfo);
        callback(markets[marketId]);
      }
    });
  },

  loadMetadata: function (market, callback) {
    var self = this;
    callback = callback || function () {};
    this.flux.augur.ramble.getMarketMetadata(market._id, {sourceless: false}, function (err, metadata) {
      if (err || !metadata) return callback(err);
      // console.info(market._id, "metadata loaded:", JSON.stringify(metadata, null, 2));
      self.dispatch(constants.market.LOAD_METADATA_SUCCESS, {metadata});
      callback();
    });
  },

  checkOrderBook: function (market) {
    var self = this;
    this.flux.augur.checkOrderBook(market, {
      onEmpty: function () {
        console.log("checkOrderBook.onEmpty: no orders found");
      },
      onPriceMatched: function (order) {
        console.log("checkOrderBook.onPriceMatched:", order);
      },
      onMarketHash: function (marketHash) {
        console.log("checkOrderBook.onMarketHash:", marketHash);
      },
      onCommitTradeSent: function (res) {
        console.log("checkOrderBook.onCommitTradeSent:", res);
      },
      onCommitTradeSuccess: function (res) {
        console.log("checkOrderBook.onCommitTradeSuccess:", res);
      },
      onCommitTradeFailed: function (err) {
        console.error("checkOrderBook.onCommitTradeFailed:", err);
      },
      onTradeSent: function (tradeSent) {
        console.log("checkOrderBook.onTradeSent:", tradeSent);
        self.dispatch(constants.market.UPDATE_ORDERS_SUCCESS, {
          orders: tradeSent.cancelled
        });
      },
      onTradeSuccess: function (res) {
        console.log("checkOrderBook.onTradeSuccess:", res);
      },
      onSuccess: function (matchedOrders) {
        console.log("checkOrderBook.onSuccess:", matchedOrders);
        self.dispatch(constants.market.CHECK_ORDER_BOOK_SUCCESS, {matchedOrders});
      },
      onFailed: function (err) {
        console.log("checkOrderBook.onFailed:", err);
      }
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

  tradeSucceeded: function (marketId) {
    console.log("Trade completed in market:", abi.hex(marketId));
    this.flux.actions.asset.updateAssets();
    this.flux.actions.market.loadMarket(marketId);
  },

  // relativeShares is a signed integer representing a trade (buy/sell)
  updatePendingShares: function (market, outcomeId, relativeShares) {
    if (market && outcomeId && relativeShares) {
      for (var i = 0; i < market.numOutcomes; ++i) {
          if (market.outcomes[i].id === Number(outcomeId)) break;
      }
      market.outcomes[i].pendingShares = market.outcomes[i].pendingShares.plus(abi.bignum(relativeShares));
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

  updateOrders: function (market, orders) {
    if (orders) {
      this.dispatch(constants.market.UPDATE_ORDERS_SUCCESS, {orders});
    }
    this.flux.actions.market.checkOrderBook(market);
  },

  closedMarket: function (market) {
    if (market && market.id) {
      this.dispatch(constants.market.CLOSED_MARKET, {market});
      this.flux.actions.market.loadMarket(market.id);
    }
  }

};
