/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var BigNumber = require("bignumber.js");
var clone = require("clone");
var abi = require("augur-abi");
var utils = require("../utilities");
var constants = require("../constants");

module.exports = {

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
      if (!marketsData || marketsData.error) {
        chunkCB(marketsData);
      } else {
        chunkCB(null, marketsData);
      }
      var pause = (Object.keys(marketsData).length) ? constants.PAUSE_BETWEEN_MARKET_BATCHES : 5;
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
      var numMarkets = parseInt(numMarketsRaw, 10);
      var firstStartIndex = isDesc ? Math.max(numMarkets - chunkSize + 1, 0) : 0;

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
    var self = this;

        // Try hitting a cache node, if available
    if (!this.augurNode.nodes.length) {
      return this.loadMarketsHelper(branchID, chunkSize, isDesc, chunkCB);
    }
    this.augurNode.getMarketsInfo(branchID, function (err, result) {
      if (err) {
        console.warn("cache node getMarketsInfo failed:", err);

        // Abandon the use of cache nodes since there was a connection issue.
        self.augurNode.nodes = [];

        // fallback to loading in batches from chain
        return self.loadMarketsHelper(branchID, chunkSize, isDesc, chunkCB);
      }
      chunkCB(null, JSON.parse(result));
    });
  },

  loadAssets: function (branchID, accountID, cbEther, cbRep, cbRealEther) {
    this.getCashBalance(accountID, function (result) {
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
    if (!positionInMarket || positionInMarket.error) return positionInMarket;
    var numOutcomes = positionInMarket.length;
    var position = {};
    for (var i = 0; i < numOutcomes; ++i) {
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
    return this.CompositeGetters.getPositionInMarket(
      market,
      account || this.from,
      callback);
  },

  adjustScalarOrder: function (order, minValue) {
    order.price = this.expandScalarPrice(minValue, order.price);
    order.fullPrecisionPrice = this.expandScalarPrice(minValue, order.fullPrecisionPrice);
    return order;
  },

  parseOrderBook: function (orderArray, scalarMinMax) {
    if (!orderArray || orderArray.error) return orderArray;
    var minValue, order;
    var isScalar = scalarMinMax &&
      scalarMinMax.minValue !== undefined &&
      scalarMinMax.maxValue !== undefined;
    if (isScalar) minValue = new BigNumber(scalarMinMax.minValue, 10);
    var numOrders = orderArray.length / 8;
    var orderBook = {buy: {}, sell: {}};
    for (var i = 0; i < numOrders; ++i) {
      order = this.parseTradeInfo(orderArray.slice(8*i, 8*(i+1)));
      if (order) {
        if (isScalar) order = this.adjustScalarOrder(order, minValue);
        orderBook[order.type][order.id] = order;
      }
    }
    return orderBook;
  },

  // scalarMinMax: null if not scalar; {minValue, maxValue} if scalar
  getOrderBook: function (market, scalarMinMax, callback) {
    var self = this;
    if (!callback && utils.is_function(scalarMinMax)) {
      callback = scalarMinMax;
      scalarMinMax = null;
    }
    var offset, numTradesToLoad;
    if (market && market.market) {
      offset = market.offset;
      numTradesToLoad = market.numTradesToLoad;
      scalarMinMax = scalarMinMax || market.scalarMinMax;
      callback = callback || market.callback;
      market = market.market;
    }
    var tx = clone(this.tx.CompositeGetters.getOrderBook);
    tx.params = [market, offset || 0, numTradesToLoad || 0];
    return this.fire(tx, callback, this.parseOrderBook, scalarMinMax);
  },

  validateMarketInfo: function (marketInfo) {
    if (!marketInfo) return null;
    var parsedMarketInfo = this.parseMarketInfo(marketInfo);
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
    var len, shift, rawInfo, info, marketID;
    if (!marketsArray || marketsArray.constructor !== Array || !marketsArray.length) {
      return marketsArray;
    }
    var marketsInfo = {};
    var totalLen = 0;
    for (var i = 0; i < numMarkets; ++i) {
      len = parseInt(marketsArray[totalLen]);
      shift = totalLen + 1;
      rawInfo = marketsArray.slice(shift, shift + len - 1);
      marketID = abi.format_int256(marketsArray[shift]);
      info = this.parseMarketInfo(rawInfo);
      if (info && info.numOutcomes) {
        marketsInfo[marketID] = info;
        marketsInfo[marketID].sortOrder = i;
      }
      totalLen += len;
    }
    return marketsInfo;
  },

  batchGetMarketInfo: function (marketIDs, account, callback) {
    if (!callback && utils.is_function(account)) {
      callback = account;
      account = null;
    }
    var tx = clone(this.tx.CompositeGetters.batchGetMarketInfo);
    tx.params = [marketIDs, account || 0];
    return this.fire(tx, callback, this.parseBatchMarketInfo, marketIDs.length);
  },

  parseMarketsInfo: function (marketsArray, branch) {
    var len, shift, marketID, fees, minValue, maxValue, numOutcomes, type, unfixed, reportedOutcome, isIndeterminate;
    if (!marketsArray || marketsArray.constructor !== Array || !marketsArray.length) {
      return null;
    }
    var numMarkets = parseInt(marketsArray.shift(), 16);
    var marketsInfo = {};
    var totalLen = 0;
    for (var i = 0; i < numMarkets; ++i) {
      len = parseInt(marketsArray[totalLen]);
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
      reportedOutcome = abi.hex(marketsArray[shift + 14], true);
      if (!abi.unfix(reportedOutcome, "number")) {
        reportedOutcome = undefined;
        isIndeterminate = undefined;
      } else {
        unfixed = this.unfixReport(reportedOutcome, minValue, maxValue, type);
        reportedOutcome = unfixed.report;
        isIndeterminate = unfixed.isIndeterminate;
      }
      marketsInfo[marketID] = {
        sortOrder: i,
        id: marketID,
        branchId: branch,
        tradingPeriod: parseInt(marketsArray[shift + 1], 16),
        tradingFee: fees.trading,
        makerFee: fees.maker,
        takerFee: fees.taker,
        creationTime: parseInt(marketsArray[shift + 3], 16),
        volume: abi.unfix(marketsArray[shift + 4], "string"),
        tags: [
          this.decodeTag(marketsArray[shift + 5]),
          this.decodeTag(marketsArray[shift + 6]),
          this.decodeTag(marketsArray[shift + 7])
        ],
        endDate: parseInt(marketsArray[shift + 8], 16),
        eventID: abi.format_int256(marketsArray[shift + 10]),
        minValue: minValue,
        maxValue: maxValue,
        numOutcomes: numOutcomes,
        type: type,
        reportedOutcome: reportedOutcome,
        isIndeterminate: isIndeterminate,
        description: abi.bytes_to_utf16(marketsArray.slice(shift + 15, shift + len - 1))
      };
      totalLen += len;
    }
    return marketsInfo;
  },

  getMarketsInfo: function (branch, offset, numMarketsToLoad, volumeMin, volumeMax, callback) {
    var self = this;
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
    // Only use cache if there are nodes available and no offset+numMarkets specified
    // Can't rely on cache for partial markets fetches since no good way to verify partial data.
    // var useCache = (this.augurNode.nodes.length > 0 && !offset && !numMarketsToLoad);
    branch = branch || this.constants.DEFAULT_BRANCH_ID;
    offset = offset || 0;
    numMarketsToLoad = numMarketsToLoad || 0;
    volumeMin = volumeMin || 0;
    volumeMax = volumeMax || 0;
    if (!this.augurNode.nodes.length) {
      var tx = clone(this.tx.CompositeGetters.getMarketsInfo);
      tx.params = [branch, offset, numMarketsToLoad, volumeMin, volumeMax];
      tx.timeout = 240000;
      return this.fire(tx, callback, this.parseMarketsInfo, branch);
    }
    this.augurNode.getMarketsInfo(branch, function (err, result) {
      if (err) {
        return self.getMarketsInfo(branch, offset, numMarketsToLoad, volumeMin, volumeMax, callback);
      }
      callback(JSON.parse(result));
    });
  }
};
