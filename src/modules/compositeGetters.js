/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var BigNumber = require("bignumber.js");
var clone = require("clone");
var abi = require("augur-abi");
var utils = require("../utilities");

BigNumber.config({MODULO_MODE: BigNumber.EUCLID});

module.exports = {

    parseOrderBook: function (orderArray, scalarMinMax) {
        if (!orderArray || orderArray.error) return orderArray;
        var minValue, maxValue, order;
        var isScalar = scalarMinMax && scalarMinMax.minValue !== undefined && scalarMinMax.maxValue !== undefined;
        if (isScalar) {
            minValue = new BigNumber(scalarMinMax.minValue, 10);
            maxValue = new BigNumber(scalarMinMax.maxValue, 10);
        }
        var numOrders = orderArray.length / 8;
        var orderBook = {buy: [], sell: []};
        for (var i = 0; i < numOrders; ++i) {
            order = this.parseTradeInfo(orderArray.slice(8*i, 8*(i+1)));
            if (isScalar) {
                order.price = this.adjustScalarPrice(order.type, minValue, maxValue, order.price);
            }
            orderBook[order.type].push(order);
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
        var tx = clone(this.tx.CompositeGetters.getMarketInfo);
        tx.params = market;
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

    batchGetMarketInfo: function (marketIDs, callback) {
        var tx = clone(this.tx.CompositeGetters.batchGetMarketInfo);
        tx.params = [marketIDs];
        return this.fire(tx, callback, this.parseBatchMarketInfo, marketIDs.length);
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
        }
        if (branch && branch.branch) {
            offset = branch.offset;
            numMarketsToLoad = branch.numMarketsToLoad;
            callback = callback || branch.callback;
            branch = branch.branch;
        }
        branch = branch || this.constants.DEFAULT_BRANCH_ID;
        offset = offset || 0;
        numMarketsToLoad = numMarketsToLoad || 0;
        var tx = clone(this.tx.CompositeGetters.getMarketsInfo);
        tx.params = [branch, offset, numMarketsToLoad];
        tx.timeout = 240000;
        return this.fire(tx, callback, this.parseMarketsInfo);
    }
};
