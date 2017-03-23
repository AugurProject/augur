/**
 * Augur JavaScript SDK
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var BigNumber = require("bignumber.js");
var clone = require("clone");
var abi = require("augur-abi");
var utils = require("../utilities");
var constants = require("../constants");

module.exports = {

  getOrderBookChunked: function (marketID, offset, numTradesToLoad, scalarMinMax, totalTrades, chunkCB, callback) {
    var self = this;
    if (!utils.is_function(chunkCB)) chunkCB = utils.noop;
    if (!totalTrades) {
      return this.get_total_trades(marketID, function (totalTrades) {
        if (!totalTrades || totalTrades.error || !parseInt(totalTrades, 10)) {
          return callback(totalTrades);
        }
        self.getOrderBookChunked(marketID, offset, Math.min(parseInt(totalTrades, 10), constants.GETTER_CHUNK_SIZE), scalarMinMax, totalTrades, chunkCB, callback);
      });
    }
    this.getOrderBook({
      market: marketID,
      offset: offset,
      numTradesToLoad: numTradesToLoad || totalTrades,
      scalarMinMax: scalarMinMax
    }, function (orderBookChunk) {
      if (!orderBookChunk || orderBookChunk.error) {
        console.error("getOrderBook failed:", marketID, orderBookChunk);
        return callback(orderBookChunk);
      }
      chunkCB(orderBookChunk);
      if (offset + numTradesToLoad < totalTrades) {
        return self.getOrderBookChunked(marketID, offset + numTradesToLoad, numTradesToLoad, scalarMinMax, totalTrades, chunkCB, callback);
      }
      callback(null);
    });
  },

  // load each batch of marketdata sequentially and recursively until complete
  loadNextMarketsBatch: function (branchID, startIndex, chunkSize, numMarkets, isDesc, volumeMin, volumeMax, chunkCB, nextPass) {
    var self = this;
    var numMarketsToLoad = isDesc ? Math.min(chunkSize, startIndex) : Math.min(chunkSize, numMarkets - startIndex);
    this.getMarketsInfo({
      branch: branchID,
      offset: startIndex,
      numMarketsToLoad: numMarketsToLoad,
      volumeMin: volumeMin,
      volumeMax: volumeMax
    }, function (marketsData) {
      var pause;
      if (!marketsData || marketsData.error) {
        chunkCB(marketsData);
      } else {
        chunkCB(null, marketsData);
      }
      pause = (Object.keys(marketsData).length) ? constants.PAUSE_BETWEEN_MARKET_BATCHES : 5;
      if (isDesc && startIndex > 0) {
        setTimeout(function () {
          self.loadNextMarketsBatch(branchID, Math.max(startIndex - chunkSize, 0), chunkSize, numMarkets, isDesc, volumeMin, volumeMax, chunkCB, nextPass);
        }, pause);
      } else if (!isDesc && startIndex + chunkSize < numMarkets) {
        setTimeout(function () {
          self.loadNextMarketsBatch(branchID, startIndex + chunkSize, chunkSize, numMarkets, isDesc, volumeMin, volumeMax, chunkCB, nextPass);
        }, pause);
      } else if (utils.is_function(nextPass)) {
        setTimeout(function () { nextPass(); }, pause);
      }
    });
  },

  loadMarketsHelper: function (branchID, chunkSize, isDesc, chunkCB) {
    var self = this;

    // load the total number of markets
    this.getNumMarketsBranch(branchID, function (numMarketsRaw) {
      var numMarkets, firstStartIndex;
      numMarkets = parseInt(numMarketsRaw, 10);
      firstStartIndex = isDesc ? Math.max(numMarkets - chunkSize + 1, 0) : 0;

      // load markets in batches
      // first pass: only markets with nonzero volume
      self.loadNextMarketsBatch(branchID, firstStartIndex, chunkSize, numMarkets, isDesc, 0, -1, chunkCB, function () {

        // second pass: zero-volume markets
        if (self.options.loadZeroVolumeMarkets) {
          self.loadNextMarketsBatch(branchID, firstStartIndex, chunkSize, numMarkets, isDesc, -1, 0, chunkCB);
        }
      });
    });
  },

  loadMarkets: function (branchID, chunkSize, isDesc, chunkCB) {
    return this.loadMarketsHelper(branchID, chunkSize, isDesc, chunkCB);
  },

  loadAssets: function (branchID, accountID, cbEther, cbRep, cbRealEther) {
    this.Cash.balance(accountID, function (result) {
      if (!result || result.error) return cbEther(result);
      return cbEther(null, abi.string(result));
    });
    this.getRepBalance(branchID, accountID, function (result) {
      if (!result || result.error) return cbRep(result);
      return cbRep(null, abi.string(result));
    });
    this.rpc.balance(accountID, function (wei) {
      if (!wei || wei.error) return cbRealEther(wei);
      return cbRealEther(null, abi.unfix(wei, "string"));
    });
  },

  finishLoadBranch: function (branch, callback) {
    if (branch.periodLength && branch.description && branch.baseReporters) {
      callback(null, branch);
    }
  },

  loadBranch: function (branchID, callback) {
    var self = this;
    var branch = {id: abi.hex(branchID)};
    this.getPeriodLength(branchID, function (periodLength) {
      if (!periodLength || periodLength.error) return callback(periodLength);
      branch.periodLength = periodLength;
      self.finishLoadBranch(branch, callback);
    });
    this.getDescription(branchID, function (description) {
      if (!description || description.error) return callback(description);
      branch.description = description;
      self.finishLoadBranch(branch, callback);
    });
    this.getBaseReporters(branchID, function (baseReporters) {
      if (!baseReporters || baseReporters.error) return callback(baseReporters);
      branch.baseReporters = parseInt(baseReporters, 10);
      self.finishLoadBranch(branch, callback);
    });
  },

  parsePositionInMarket: function (positionInMarket) {
    var numOutcomes, position, i;
    if (!positionInMarket || positionInMarket.error) return positionInMarket;
    numOutcomes = positionInMarket.length;
    position = {};
    for (i = 0; i < numOutcomes; ++i) {
      position[i + 1] = abi.unfix(abi.hex(positionInMarket[i], true), "string");
    }
    return position;
  },

  getPositionInMarket: function (market, account, callback) {
    if (!callback && utils.is_function(account)) {
      callback = account;
      account = null;
    }
    if (market && market.market) {
      account = market.account;
      callback = callback || market.callback;
      market = market.market;
    }
    return this.CompositeGetters.getPositionInMarket(market, account || this.from, callback);
  },

  parseOrderBook: function (orderArray, scalarMinMax) {
    var minValue, order, isScalar, numOrders, orderBook, i;
    if (!orderArray || orderArray.error) return orderArray;
    isScalar = scalarMinMax &&
      scalarMinMax.minValue !== undefined &&
      scalarMinMax.maxValue !== undefined;
    if (isScalar) minValue = new BigNumber(scalarMinMax.minValue, 10);
    numOrders = orderArray.length / 8;
    orderBook = {buy: {}, sell: {}};
    for (i = 0; i < numOrders; ++i) {
      order = this.parseTradeInfo(orderArray.slice(8*i, 8*(i + 1)));
      if (order) {
        if (isScalar) order = this.adjustScalarOrder(order, minValue);
        orderBook[order.type][order.id] = order;
      }
    }
    return orderBook;
  },

  // scalarMinMax: null if not scalar; {minValue, maxValue} if scalar
  getOrderBook: function (market, scalarMinMax, callback) {
    var offset, numTradesToLoad, tx;
    if (!callback && utils.is_function(scalarMinMax)) {
      callback = scalarMinMax;
      scalarMinMax = null;
    }
    if (market && market.market) {
      offset = market.offset;
      numTradesToLoad = market.numTradesToLoad;
      scalarMinMax = scalarMinMax || market.scalarMinMax;
      callback = callback || market.callback;
      market = market.market;
    }
    tx = clone(this.tx.CompositeGetters.getOrderBook);
    tx.params = [market, offset || 0, numTradesToLoad || 0];
    return this.fire(tx, callback, this.parseOrderBook, scalarMinMax);
  },

  validateMarketInfo: function (marketInfo) {
    var parsedMarketInfo;
    if (!marketInfo) return null;
    parsedMarketInfo = this.parseMarketInfo(marketInfo);
    if (!parsedMarketInfo.numOutcomes) return null;
    return parsedMarketInfo;
  },

  // account is optional, if provided will return sharesPurchased
  getMarketInfo: function (market, account, callback) {
    if (market && market.market) {
      callback = callback || market.callback;
      account = market.account;
      market = market.market;
    }
    if (!callback && utils.is_function(account)) {
      callback = account;
      account = null;
    }
    return this.CompositeGetters.getMarketInfo(market, account || 0, callback);
  },

  parseBatchMarketInfo: function (marketsArray, numMarkets) {
    var len, shift, rawInfo, info, marketID, marketsInfo, totalLen, i;
    if (!marketsArray || marketsArray.constructor !== Array || !marketsArray.length) {
      return marketsArray;
    }
    marketsInfo = {};
    totalLen = 0;
    for (i = 0; i < numMarkets; ++i) {
      len = parseInt(marketsArray[totalLen], 16);
      shift = totalLen + 1;
      rawInfo = marketsArray.slice(shift, shift + len - 1);
      marketID = abi.format_int256(marketsArray[shift]);
      info = this.parseMarketInfo(rawInfo);
      if (info && info.numOutcomes) marketsInfo[marketID] = info;
      totalLen += len;
    }
    return marketsInfo;
  },

  batchGetMarketInfo: function (marketIDs, account, callback) {
    var tx;
    if (!callback && utils.is_function(account)) {
      callback = account;
      account = null;
    }
    tx = clone(this.tx.CompositeGetters.batchGetMarketInfo);
    tx.params = [marketIDs, account || 0];
    return this.fire(tx, callback, this.parseBatchMarketInfo, marketIDs.length);
  },

  parseMarketsInfo: function (marketsArray, branch) {
    var len, shift, marketID, fees, minValue, maxValue, numOutcomes, type, unfixed, consensusOutcomeID, consensus, numMarkets, marketsInfo, totalLen, i, topic;
    if (!marketsArray || marketsArray.constructor !== Array || !marketsArray.length) {
      return null;
    }
    numMarkets = parseInt(marketsArray.shift(), 16);
    marketsInfo = {};
    totalLen = 0;
    for (i = 0; i < numMarkets; ++i) {
      len = parseInt(marketsArray[totalLen], 16);
      shift = totalLen + 1;
      marketID = abi.format_int256(marketsArray[shift]);
      fees = this.calculateMakerTakerFees(marketsArray[shift + 2], marketsArray[shift + 9]);
      minValue = abi.unfix_signed(marketsArray[shift + 11], "string");
      maxValue = abi.unfix_signed(marketsArray[shift + 12], "string");
      numOutcomes = parseInt(marketsArray[shift + 13], 16);
      if (numOutcomes > 2) {
        type = "categorical";
      } else if (minValue === "1" && maxValue === "2") {
        type = "binary";
      } else {
        type = "scalar";
      }
      consensusOutcomeID = abi.hex(marketsArray[shift + 14], true);
      if (!abi.unfix(consensusOutcomeID, "number")) {
        consensus = null;
      } else {
        unfixed = this.unfixConsensusOutcome(consensusOutcomeID, minValue, maxValue, type);
        consensus = {
          outcomeID: unfixed.outcomeID,
          isIndeterminate: unfixed.isIndeterminate
        };
      }
      topic = this.decodeTag(marketsArray[shift + 5]);
      marketsInfo[marketID] = {
        id: marketID,
        branchID: branch,
        tradingPeriod: parseInt(marketsArray[shift + 1], 16),
        tradingFee: fees.trading,
        makerFee: fees.maker,
        takerFee: fees.taker,
        creationTime: parseInt(marketsArray[shift + 3], 16),
        volume: abi.unfix(marketsArray[shift + 4], "string"),
        topic: topic,
        tags: [topic, this.decodeTag(marketsArray[shift + 6]), this.decodeTag(marketsArray[shift + 7])],
        endDate: parseInt(marketsArray[shift + 8], 16),
        eventID: abi.format_int256(marketsArray[shift + 10]),
        minValue: minValue,
        maxValue: maxValue,
        numOutcomes: numOutcomes,
        type: type,
        consensus: consensus,
        description: abi.bytes_to_utf16(marketsArray.slice(shift + 15, shift + len - 1))
      };
      totalLen += len;
    }
    return marketsInfo;
  },

  getMarketsInfo: function (branch, offset, numMarketsToLoad, volumeMin, volumeMax, callback) {
    var tx, self = this;
    if (!callback && utils.is_function(offset)) {
      callback = offset;
      offset = null;
      numMarketsToLoad = null;
      volumeMin = null;
      volumeMax = null;
    }
    if (branch && branch.branch) {
      offset = branch.offset;
      numMarketsToLoad = branch.numMarketsToLoad;
      volumeMin = branch.volumeMin;
      volumeMax = branch.volumeMax;
      callback = callback || branch.callback;
      branch = branch.branch;
    }
    branch = branch || this.constants.DEFAULT_BRANCH_ID;
    offset = offset || 0;
    numMarketsToLoad = numMarketsToLoad || 0;
    volumeMin = volumeMin || 0;
    volumeMax = volumeMax || 0;
    tx = clone(this.tx.CompositeGetters.getMarketsInfo);
    tx.params = [branch, offset, numMarketsToLoad, volumeMin, volumeMax];
    tx.timeout = 240000;
    return this.fire(tx, callback, this.parseMarketsInfo, branch);
  }
};
