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

BigNumber.config({MODULO_MODE: BigNumber.EUCLID});

module.exports = {

    // load each batch of marketdata sequentially and recursively until complete
    loadNextMarketsBatch: function (branchID, startIndex, chunkSize, numMarkets, isDesc, chunkCB) {
        var self = this;
        this.getMarketsInfo({
            branch: branchID,
            offset: startIndex,
            numMarketsToLoad: chunkSize
        }, function (marketsData) {
            if (!marketsData || marketsData.error) {
                chunkCB(marketsData);
            } else {
                chunkCB(null, marketsData);
            }
            if (isDesc && startIndex > 0) {
                setTimeout(function () {
                    self.loadNextMarketsBatch(branchID, Math.max(startIndex - chunkSize, 0), chunkSize, numMarkets, isDesc, chunkCB);
                }, constants.PAUSE_BETWEEN_MARKET_BATCHES);
            } else if (!isDesc && startIndex < numMarkets) {
                setTimeout(function () {
                    self.loadNextMarketsBatch(branchID, startIndex + chunkSize, chunkSize, numMarkets, isDesc, chunkCB);
                }, constants.PAUSE_BETWEEN_MARKET_BATCHES);
            }
        });
    },

    loadMarkets: function (branchID, chunkSize, isDesc, chunkCB) {
        var self = this;

        // load the total number of markets
        this.getNumMarketsBranch(branchID, function (numMarketsRaw) {
            var numMarkets = parseInt(numMarketsRaw, 10);
            var firstStartIndex = isDesc ? Math.max(numMarkets - chunkSize + 1, 0) : 0;

            // load markets in batches
            self.loadNextMarketsBatch(branchID, firstStartIndex, chunkSize, numMarkets, isDesc, chunkCB);
        });
    },

    loadAssets: function (branchID, accountID, cbEther, cbRep, cbRealEther) {
        this.getCashBalance(accountID, function (result) {
            if (!result || result.error) return cbEther(result);
            return cbEther(null, parseFloat(result, 10));
        });
        this.getRepBalance(branchID, accountID, function (result) {
            if (!result || result.error) return cbRep(result);
            return cbRep(null, parseFloat(result, 10));
        });
        this.rpc.balance(accountID, function (wei) {
            if (!wei || wei.error) return cbRealEther(wei);
            return cbRealEther(null, abi.bignum(wei).dividedBy(constants.ONE).toNumber());
        });
    },

    finishLoadBranch: function (branch, callback) {
        if (branch.periodLength && branch.description) {
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
    },

    parseOrderBook: function (orderArray, scalarMinMax) {
        if (!orderArray || orderArray.error) return orderArray;
        var minValue, order;
        var isScalar = scalarMinMax && scalarMinMax.minValue !== undefined && scalarMinMax.maxValue !== undefined;
        if (isScalar) minValue = new BigNumber(scalarMinMax.minValue, 10);
        var numOrders = orderArray.length / 8;
        var orderBook = {buy: {}, sell: {}};
        for (var i = 0; i < numOrders; ++i) {
            order = this.parseTradeInfo(orderArray.slice(8*i, 8*(i+1)));
            if (isScalar) order.price = this.expandScalarPrice(minValue, order.price);
            orderBook[order.type][order.id] = order;
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
        if (market && market.market) {
            scalarMinMax = market.scalarMinMax;
            callback = callback || market.callback;
            market = market.market;
        }
        var tx = clone(this.tx.CompositeGetters.getOrderBook);
        tx.params = market;
        return this.fire(tx, callback, this.parseOrderBook, scalarMinMax);
    },

    validateMarketInfo: function (marketInfo) {
        if (!marketInfo) return null;
        var parsedMarketInfo = this.parseMarketInfo(marketInfo);
        if (!parsedMarketInfo.numOutcomes) return null;
        return parsedMarketInfo;
    },

    getMarketInfo: function (market, callback) {
        var self = this;
        if (market && market.market) {
            callback = callback || market.callback;
            market = market.market;
        }
        if (self.augurNode.nodes.length > 0){
            self.augurNode.getMarketInfo(market, (err, result) => {
                //TODO: prob fallback to on chain fetch
               if (err) return callback(null);
               return callback(result);
            });
        }else{
            var tx = clone(this.tx.CompositeGetters.getMarketInfo);
            tx.params = market;
            tx.timeout = 45000;
            return this.fire(tx, callback, this.validateMarketInfo);
        }
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
            marketID = marketsArray[shift];
            info = this.parseMarketInfo(rawInfo);
            if (info && info.numOutcomes) {
                marketsInfo[marketID] = info;
                marketsInfo[marketID].sortOrder = i;
            }
            totalLen += len;
        }
        return marketsInfo;
    },

    batchGetMarketInfo: function (marketIDs, callback) {
        var self = this;
        if (self.augurNode.nodes.length > 0){
            self.augurNode.batchGetMarketInfo(marketIDs, (err, result) => {
                //TODO: prob fallback to on chain fetch
               if (err) return callback(null);
               return callback(result);
            });
        }else{
            var tx = clone(this.tx.CompositeGetters.batchGetMarketInfo);
            tx.params = [marketIDs];
            return this.fire(tx, callback, this.parseBatchMarketInfo, marketIDs.length);
        }
    },

    parseMarketsInfo: function (marketsArray) {
        var len, shift, marketID, fees;
        if (!marketsArray || marketsArray.constructor !== Array || !marketsArray.length) {
            return marketsArray;
        }
        var numMarkets = parseInt(marketsArray.shift(), 16);
        var marketsInfo = {};
        var totalLen = 0;
        for (var i = 0; i < numMarkets; ++i) {
            len = parseInt(marketsArray[totalLen]);
            shift = totalLen + 1;
            marketID = marketsArray[shift];
            fees = this.calculateMakerTakerFees(marketsArray[shift + 2], marketsArray[shift + 9]);
            marketsInfo[marketID] = {
                sortOrder: i,
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
                description: abi.bytes_to_utf16(marketsArray.slice(shift + 10, shift + len - 1))
            };
            totalLen += len;
        }
        return marketsInfo;
    },

    getMarketsInfo: function (branch, offset, numMarketsToLoad, callback) {
        var self = this;
        if (!callback && utils.is_function(offset)) {
            callback = offset;
            offset = null;
            numMarketsToLoad = null;
        }
        if (branch && branch.branch) {
            offset = branch.offset;
            numMarketsToLoad = branch.numMarketsToLoad;
            callback = callback || branch.callback;
            branch = branch.branch;
        }
        //Only use cache if there are nodes available and no offset+numMarkets specified
        //Can't rely on cache for partial markets fetches since no good way to verify partial data.
        var useCache = (self.augurNode.nodes.length > 0 && !offset && !numMarketsToLoad);
        branch = branch || this.constants.DEFAULT_BRANCH_ID;
        offset = offset || 0;
        numMarketsToLoad = numMarketsToLoad || 0;
        if (useCache){
            self.augurNode.getMarketsInfo(branch, (err, result) => {
                //TODO: prob fallback to on chain fetch
               if (err) return callback(null);
               return callback(result);
            });
        }else{
            var tx = clone(this.tx.CompositeGetters.getMarketsInfo);
            tx.params = [branch, offset, numMarketsToLoad];
            tx.timeout = 240000;
            return this.fire(tx, callback, this.parseMarketsInfo);
        }
    }
};
