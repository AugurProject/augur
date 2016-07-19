/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var BigNumber = require("bignumber.js");
var clone = require("clone");
var utils = require("../utilities");

BigNumber.config({MODULO_MODE: BigNumber.EUCLID});

module.exports = {

    // scalarMinMax: null if not scalar; {minValue, maxValue} if scalar
    getOrderBook: function (marketID, scalarMinMax, callback) {
        var self = this;
        if (!callback && utils.is_function(scalarMinMax)) {
            callback = scalarMinMax;
            scalarMinMax = null;
        }
        var isScalar = scalarMinMax &&
            scalarMinMax.minValue !== undefined &&
            scalarMinMax.maxValue !== undefined;
        function getOrderBook(orderArray) {
            if (!orderArray || orderArray.error) return orderArray;
            var minValue, maxValue, numOrders, order;
            if (isScalar) {
                minValue = new BigNumber(scalarMinMax.minValue, 10);
                maxValue = new BigNumber(scalarMinMax.maxValue, 10);
            }
            numOrders = orderArray.length / 8;
            var orderBook = {buy: [], sell: []};
            for (var i = 0; i < numOrders; ++i) {
                order = self.parseTradeInfo(orderArray.slice(8*i, 8*(i+1)));
                if (isScalar) {
                    order.price = self.adjustScalarPrice(order.type, minValue, maxValue, order.price);
                }
                orderBook[order.type].push(order);
            }
            return orderBook;
        }
        var tx = clone(this.tx.CompositeGetters.getOrderBook);
        tx.params = marketID;
        if (!utils.is_function(callback)) return getOrderBook(this.fire(tx));
        this.fire(tx, function (orderArray) {
            callback(getOrderBook(orderArray));
        });
    },

    getMarketInfo: function (market, callback) {
        var self = this;
        var tx = clone(this.tx.CompositeGetters.getMarketInfo);
        var unpacked = utils.unpack(market, utils.labels(this.getMarketInfo), arguments);
        tx.params = unpacked.params;
        tx.timeout = 45000;
        if (unpacked && utils.is_function(unpacked.cb[0])) {
            return this.fire(tx, function (marketInfo) {
                if (!marketInfo) return callback(self.errors.NO_MARKET_INFO);
                self.parseMarketInfo(marketInfo, {combinatorial: true}, function (info) {
                    if (info.numEvents && info.numOutcomes) {
                        unpacked.cb[0](info);
                    } else {
                        unpacked.cb[0](null);
                    }
                });
            });
        }
        var marketInfo = this.parseMarketInfo(this.fire(tx));
        if (marketInfo.numOutcomes && marketInfo.numEvents) {
            return marketInfo;
        } else {
            return null;
        }
    },

    batchGetMarketInfo: function (marketIDs, callback) {
        var self = this;
        function batchGetMarketInfo(marketsArray) {
            var len, shift, rawInfo, info, marketID;
            if (!marketsArray || marketsArray.constructor !== Array || !marketsArray.length) {
                return marketsArray;
            }
            var numMarkets = marketIDs.length;
            var marketsInfo = {};
            var totalLen = 0;
            for (var i = 0; i < numMarkets; ++i) {
                len = parseInt(marketsArray[totalLen]);
                shift = totalLen + 1;
                rawInfo = marketsArray.slice(shift, shift + len - 1);
                marketID = marketsArray[shift];
                info = self.parseMarketInfo(rawInfo);
                if (info && parseInt(info.numEvents) && info.numOutcomes) {
                    marketsInfo[marketID] = info;
                    marketsInfo[marketID].sortOrder = i;
                }
                totalLen += len;
            }
            return marketsInfo;
        }
        var tx = clone(this.tx.CompositeGetters.batchGetMarketInfo);
        tx.params = [marketIDs];
        if (!utils.is_function(callback)) {
            return batchGetMarketInfo(this.fire(tx));
        }
        this.fire(tx, function (marketsArray) {
            callback(batchGetMarketInfo(marketsArray));
        });
    },

    getMarketsInfo: function (options, callback) {
        // options: {branch, offset, numMarketsToLoad, callback}
        var self = this;
        if (utils.is_function(options) && !callback) {
            callback = options;
            options = {};
        }
        options = options || {};
        var branch = options.branch || this.constants.DEFAULT_BRANCH_ID;
        var offset = options.offset || 0;
        var numMarketsToLoad = options.numMarketsToLoad || 0;
        if (!callback && utils.is_function(options.callback)) {
            callback = options.callback;
        }
        var tx = clone(this.tx.CompositeGetters.getMarketsInfo);
        tx.params = [branch, offset, numMarketsToLoad];
        tx.timeout = 240000;
        if (!utils.is_function(callback)) {
            return this.parseMarketsArray(this.fire(tx));
        }
        this.fire(tx, function (marketsArray) {
            callback(self.parseMarketsArray(marketsArray));
        });
    }
};
