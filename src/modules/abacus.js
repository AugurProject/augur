/**
 * Utility functions that do a local calculation (i.e., these functions do not
 * make RPC requests).
 */

"use strict";

var async = require("async");
var BigNumber = require("bignumber.js");
var clone = require("clone");
var bs58 = require("bs58");
var abi = require("augur-abi");
var utils = require("../utilities");

BigNumber.config({MODULO_MODE: BigNumber.EUCLID});

module.exports = {

    sumTrades: function (trade_ids) {
        var trades = new BigNumber(0);
        for (var i = 0, numTrades = trade_ids.length; i < numTrades; ++i) {
            trades = abi.wrap(trades.plus(abi.bignum(trade_ids[i], null, true)));
        }
        return abi.hex(trades, true);
    },

    makeTradeHash: function (max_value, max_amount, trade_ids) {
        return utils.sha3([
            this.sumTrades(trade_ids),
            abi.fix(max_amount, "hex"),
            abi.fix(max_value, "hex")
        ]);
    },

    calculateTradingFees: function (makerFee, takerFee) {
        var bnMakerFee = abi.bignum(makerFee);
        var tradingFee = abi.bignum(takerFee).plus(bnMakerFee).dividedBy(new BigNumber("1.5"));
        var makerProportionOfFee = bnMakerFee.dividedBy(tradingFee);
        return {tradingFee: tradingFee, makerProportionOfFee: makerProportionOfFee};
    },

    formatTags: function (tags) {
        if (!tags || tags.constructor !== Array) tags = [];
        if (tags.length) {
            for (var i = 0; i < tags.length; ++i) {
                if (tags[i] === null || tags[i] === undefined || tags[i] === "") {
                    tags[i] = "0x0";
                } else {
                    tags[i] = abi.short_string_to_int256(tags[i]);
                }
            }
        }
        while (tags.length < 3) {
            tags.push("0x0");
        }
        return tags;
    },

    calculateRequiredMarketValue: function (gasPrice) {
        gasPrice = abi.bignum(gasPrice);
        return abi.prefix_hex((new BigNumber("1200000").times(gasPrice).plus(new BigNumber("500000").times(gasPrice))).toString(16));
    },

    // expects BigNumber inputs
    calculatePriceDepth: function (liquidity, startingQuantity, bestStartingQuantity, halfPriceWidth, minValue, maxValue) {
        return startingQuantity.times(minValue.plus(maxValue).minus(halfPriceWidth)).dividedBy(liquidity.minus(new BigNumber(2).times(bestStartingQuantity)));
    },

    // type: "buy" or "sell"
    // minValue, maxValue as BigNumber
    // price: unadjusted price
    adjustScalarPrice: function (type, minValue, maxValue, price) {
        if (type === "buy") {
            return new BigNumber(price, 10).minus(minValue).toFixed();
        }
        return maxValue.minus(new BigNumber(price, 10)).toFixed();
    },

    parseTradeInfo: function (trade) {
        return {
            id: trade[0],
            type: (trade[1] === "0x1") ? "buy" : "sell", // 0x1=buy, 0x2=sell
            market: trade[2],
            amount: abi.unfix(trade[3], "string"),
            price: abi.unfix(trade[4], "string"),
            owner: abi.format_address(trade[5], true),
            block: parseInt(trade[6]),
            outcome: abi.string(trade[7])
        };
    },

    decodeTag: function (tag) {
        try {
            return (tag && tag !== "0x0" && tag !== "0x") ?
                abi.int256_to_short_string(abi.unfork(tag, true)) : null;
        } catch (exc) {
            if (this.options.debug.broadcast) console.error(exc, tag);
            return null;
        }
    },

    parseMarketInfo: function (rawInfo, options, callback) {
        var EVENTS_FIELDS = 6;
        var OUTCOMES_FIELDS = 2;
        var WINNING_OUTCOMES_FIELDS = 8;
        var info = {};
        if (rawInfo && rawInfo.length > 14 && rawInfo[0] && rawInfo[4] && rawInfo[7] && rawInfo[8]) {
            // marketInfo[0] = marketID
            // marketInfo[1] = MARKETS.getMakerFees(marketID)
            // marketInfo[2] = numOutcomes
            // marketInfo[3] = MARKETS.getTradingPeriod(marketID)
            // marketInfo[4] = MARKETS.getTradingFee(marketID)
            // marketInfo[5] = MARKETS.getBranchID(marketID)
            // marketInfo[6] = MARKETS.getCumScale(marketID)
            // marketInfo[7] = MARKETS.getCreationTime(marketID)
            // marketInfo[8] = MARKETS.getVolume(marketID)
            // marketInfo[9] = INFO.getCreationFee(marketID)
            // marketInfo[10] = INFO.getCreator(marketID)
            // tags = MARKETS.returnTags(marketID, outitems=3)
            // marketInfo[11] = tags[0]
            // marketInfo[12] = tags[1]
            // marketInfo[13] = tags[2]
            var index = 14;
            var makerProportionOfFee = abi.unfix(rawInfo[1]);
            var tradingFee = abi.unfix(rawInfo[4]);
            var makerFee = tradingFee.times(makerProportionOfFee);
            info = {
                network: this.network_id,
                makerFee: makerFee.toFixed(),
                takerFee: new BigNumber("1.5").times(tradingFee).minus(makerFee).toFixed(),
                tradingFee: tradingFee.toFixed(),
                numOutcomes: parseInt(rawInfo[2], 16),
                tradingPeriod: parseInt(rawInfo[3], 16),
                branchId: rawInfo[5],
                numEvents: 1,
                cumulativeScale: abi.unfix(rawInfo[6], "string"),
                creationTime: parseInt(rawInfo[7], 16),
                volume: abi.unfix(rawInfo[8], "string"),
                creationFee: abi.unfix(rawInfo[9], "string"),
                author: abi.format_address(rawInfo[10]),
                tags: [
                    this.decodeTag(rawInfo[11]),
                    this.decodeTag(rawInfo[12]),
                    this.decodeTag(rawInfo[13])
                ],
                winningOutcomes: []
            };
            info.outcomes = new Array(info.numOutcomes);

            // organize event info
            // [eventID, expirationDate, outcome, minValue, maxValue, numOutcomes]
            var event = {
                id: rawInfo[index],
                endDate: parseInt(rawInfo[index + 1], 16),
                outcome: abi.unfix(rawInfo[index + 2], "string"),
                minValue: abi.unfix(rawInfo[index + 3], "string"),
                maxValue: abi.unfix(rawInfo[index + 4], "string"),
                numOutcomes: parseInt(rawInfo[index + 5], 16)
            };

            // event type: binary, categorical, or scalar
            if (event.numOutcomes !== 2) {
                event.type = "categorical";
            } else if (event.minValue === '1' && event.maxValue === '2') {
                event.type = "binary";
            } else {
                event.type = "scalar";
            }
            info.type = event.type;
            info.endDate = event.endDate;
            info.events = [event];
            index += EVENTS_FIELDS;

            // organize outcome info
            for (var i = 0; i < info.numOutcomes; ++i) {
                info.outcomes[i] = {
                    id: i + 1,
                    outstandingShares: abi.unfix(rawInfo[i*OUTCOMES_FIELDS + index], "string"),
                    price: abi.unfix(rawInfo[i*OUTCOMES_FIELDS + index + 1], "string")
                };
            }
            index += info.numOutcomes*OUTCOMES_FIELDS;
            info.winningOutcomes = abi.string(
                rawInfo.slice(index, index + WINNING_OUTCOMES_FIELDS)
            );
            index += WINNING_OUTCOMES_FIELDS;

            // convert description byte array to unicode
            var descriptionLength = parseInt(rawInfo[index], 16);
            ++index;
            info.description = abi.bytes_to_utf16(rawInfo.slice(index, index + descriptionLength));
            index += descriptionLength;

            // convert resolution byte array to unicode
            var resolutionLength = parseInt(rawInfo[index], 16);
            ++index;
            info.resolution = abi.bytes_to_utf16(rawInfo.slice(index, index + resolutionLength));
            index += resolutionLength;

            // convert extraInfo byte array to unicode
            var extraInfoLength = parseInt(rawInfo[index], 16);
            ++index;
            info.extraInfo = abi.bytes_to_utf16(rawInfo.slice(rawInfo.length - extraInfoLength));

            if (!utils.is_function(callback)) return info;
            return callback(info);
        }
        if (!utils.is_function(callback)) return info;
        callback(info);
    },

    parseMarketsArray: function (marketsArray) {
        var numMarkets, marketsInfo, totalLen, len, shift, marketID;
        if (!marketsArray || marketsArray.constructor !== Array || !marketsArray.length) {
            return marketsArray;
        }
        numMarkets = parseInt(marketsArray.shift());
        marketsInfo = {};
        totalLen = 0;
        for (var i = 0; i < numMarkets; ++i) {
            len = parseInt(marketsArray[totalLen]);
            shift = totalLen + 1;
            marketID = marketsArray[shift];
            var makerProportionOfFee = abi.unfix(marketsArray[shift + 9]);
            var tradingFee = abi.unfix(marketsArray[shift + 2]);
            var makerFee = tradingFee.times(makerProportionOfFee);
            marketsInfo[marketID] = {
                _id: marketID,
                sortOrder: i,
                tradingPeriod: parseInt(marketsArray[shift + 1]),
                tradingFee: abi.unfix(marketsArray[shift + 2], "string"),
                creationTime: parseInt(marketsArray[shift + 3]),
                volume: abi.unfix(marketsArray[shift + 4], "string"),
                tags: [
                    this.decodeTag(marketsArray[shift + 5]),
                    this.decodeTag(marketsArray[shift + 6]),
                    this.decodeTag(marketsArray[shift + 7])
                ],
                endDate: parseInt(marketsArray[shift + 8]),
                makerFee: makerFee.toFixed(),
                takerFee: new BigNumber("1.5").times(tradingFee).minus(makerFee).toFixed(),
                description: abi.bytes_to_utf16(marketsArray.slice(shift + 10, shift + len - 1))
            };
            totalLen += len;
        }
        return marketsInfo;
    },

    base58Decrypt: function (secureLoginID) {
        return JSON.parse(new Buffer(bs58.decode(secureLoginID)).toString('utf8'));
    },

    base58Encrypt: function (keystore) {
        return bs58.encode(new Buffer(JSON.stringify(keystore), "utf8"));
    }
};
