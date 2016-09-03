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

BigNumber.config({
    MODULO_MODE: BigNumber.EUCLID,
    ROUNDING_MODE: BigNumber.ROUND_HALF_DOWN
});

module.exports = {

    // load each batch of marketdata sequentially and recursively until complete
    loadNextMarketsBatch: function (branchID, startIndex, chunkSize, numMarkets, isDesc, volumeMin, volumeMax, chunkCB, nextPass) {
        var self = this;
        this.getMarketsInfo({
            branch: branchID,
            offset: startIndex,
            numMarketsToLoad: Math.min(chunkSize, numMarkets - startIndex),
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

                // fallback to loading in batches from chain
                return self.loadMarketsHelper(branchID, chunkSize, isDesc, chunkCB);
            }
            chunkCB(null, JSON.parse(result));
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
            if (order) {
                if (isScalar) order.price = this.expandScalarPrice(minValue, order.price);
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

    // account is optional, if provided will return sharesPurchased
    getMarketInfo: function (market, account, callback) {
        var self = this;
        if (market && market.market) {
            callback = callback || market.callback;
            account = market.account;
            market = market.market;
        }
        if (!callback && utils.is_function(account)) {
            callback = account;
            account = null;
        }
        var tx = clone(this.tx.CompositeGetters.getMarketInfo);
        tx.params = [market, account || 0];
        tx.timeout = 45000;
        return this.fire(tx, callback, this.validateMarketInfo);
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

    batchGetMarketInfo: function (marketIDs, account, callback) {
        if (!callback && utils.is_function(account)) {
            callback = account;
            account = null;
        }
        var tx = clone(this.tx.CompositeGetters.batchGetMarketInfo);
        tx.params = [marketIDs, account || 0];
        return this.fire(tx, callback, this.parseBatchMarketInfo, marketIDs.length);
    },

    parseMarketsInfo: function (marketsArray) {
        var len, shift, marketID, fees;
        if (!marketsArray || marketsArray.constructor !== Array || !marketsArray.length) {
            return null;
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
            return this.fire(tx, callback, this.parseMarketsInfo);
        }
        this.augurNode.getMarketsInfo(branch, function (err, result) {
            if (err) {
                return self.getMarketsInfo(branch, offset, numMarketsToLoad, volumeMin, volumeMax, callback);
            }
            callback(JSON.parse(result));
        });
    }
};
