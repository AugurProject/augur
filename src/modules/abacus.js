/**
 * Utility functions that do a local calculation (i.e., these functions do not
 * make RPC requests).
 */

"use strict";

var async = require("async");
var BigNumber = require("bignumber.js");
var clone = require("clone");
var abi = require("augur-abi");
var utils = require("../utilities");
var bs58 = require("bs58");

BigNumber.config({MODULO_MODE: BigNumber.EUCLID});

module.exports = {

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

            // all-inclusive except price history
            // info[1] = self.Markets[marketID].currentParticipant
            // info[2] = self.Markets[marketID].makerFees
            // info[3] = participantNumber
            // info[4] = self.Markets[marketID].numOutcomes
            // info[5] = self.Markets[marketID].tradingPeriod
            // info[6] = self.Markets[marketID].tradingFee
            // info[7] = self.Markets[marketID].branch
            // info[8] = self.Markets[marketID].lenEvents
            // info[9] = self.Markets[marketID].cumulativeScale
            // info[10] = self.Markets[marketID].blockNum
            // info[11] = self.Markets[marketID].volume
            // info[12] = INFO.getCreationFee(marketID)
            // info[13] = INFO.getCreator(marketID)
            // info[14] = self.Markets[marketID].tag1
            // info[15] = self.Markets[marketID].tag2
            // info[16] = self.Markets[marketID].tag3
            var index = 17;
            var makerProportionOfFee = abi.unfix(rawInfo[2]);
            var tradingFee = abi.unfix(rawInfo[6]);
            var makerFee = tradingFee.times(makerProportionOfFee);
            info = {
                network: this.network_id,
                makerFee: makerFee.toFixed(),
                takerFee: new BigNumber("1.5").times(tradingFee).minus(makerFee).toFixed(),
                numOutcomes: abi.number(rawInfo[4]),
                tradingPeriod: abi.number(rawInfo[5]),
                branchId: rawInfo[7],
                numEvents: parseInt(rawInfo[8]),
                cumulativeScale: abi.unfix(rawInfo[9], "string"),
                creationTime: parseInt(rawInfo[10]),
                volume: abi.unfix(rawInfo[11], "string"),
                creationFee: abi.unfix(rawInfo[12], "string"),
                author: abi.format_address(rawInfo[13]),
                tags: [
                    this.decodeTag(rawInfo[14]),
                    this.decodeTag(rawInfo[15]),
                    this.decodeTag(rawInfo[16])
                ],
                type: null,
                endDate: null,
                winningOutcomes: [],
                description: null
            };
            info.outcomes = new Array(info.numOutcomes);
            info.events = new Array(info.numEvents);

            // organize event info
            // [eventID, expirationDate, outcome, minValue, maxValue, numOutcomes]
            var endDate;
            for (var i = 0; i < info.numEvents; ++i) {
                endDate = parseInt(rawInfo[i*EVENTS_FIELDS + index + 1]);
                info.events[i] = {
                    id: rawInfo[i*EVENTS_FIELDS + index],
                    endDate: endDate,
                    outcome: abi.unfix(rawInfo[i*EVENTS_FIELDS + index + 2], "string"),
                    minValue: abi.unfix(rawInfo[i*EVENTS_FIELDS + index + 3], "string"),
                    maxValue: abi.unfix(rawInfo[i*EVENTS_FIELDS + index + 4], "string"),
                    numOutcomes: abi.number(rawInfo[i*EVENTS_FIELDS + index + 5])
                };
                // market type: binary, categorical, or scalar
                if (info.events[i].numOutcomes !== 2) {
                    info.events[i].type = "categorical";
                } else if (info.events[i].minValue === '1' && info.events[i].maxValue === '2') {
                    info.events[i].type = "binary";
                } else {
                    info.events[i].type = "scalar";
                }
                if (info.endDate === null || endDate > info.endDate) {
                    info.endDate = endDate;
                }
            }

            // organize outcome info
            index += info.numEvents*EVENTS_FIELDS;
            for (i = 0; i < info.numOutcomes; ++i) {
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
            try {
                info.description = abi.bytes_to_utf16(rawInfo.slice(rawInfo.length - parseInt(rawInfo[index])));
            } catch (exc) {
                if (this.options.debug.broadcast) console.error(exc, rawInfo);
                info.description = "";
            }

            // market types: binary, categorical, scalar, combinatorial
            if (info.numEvents === 1) {
                info.type = info.events[0].type;
                if (!utils.is_function(callback)) return info;
                return callback(info);
            }

            // multi-event (combinatorial) markets: batch event descriptions
            info.type = "combinatorial";
            // if (options && options.combinatorial) {
            //     var txList = new Array(info.numEvents);
            //     for (i = 0; i < info.numEvents; ++i) {
            //         txList[i] = clone(this.tx.getDescription);
            //         txList[i].params = info.events[i].id;
            //     }
            //     if (utils.is_function(callback)) {
            //         return rpc.batch(txList, function (response) {
            //             for (var i = 0, len = response.length; i < len; ++i) {
            //                 info.events[i].description = response[i];
            //             }
            //             callback(info);
            //         });
            //     }
            //     var response = rpc.batch(txList);
            //     for (i = 0; i < response.length; ++i) {
            //         info.events[i].description = response[i];
            //     }
            // }
        }
        if (!utils.is_function(callback)) return info;
        callback(info);
    },


    parseMarketInfoCache: function (rawInfo, callback) {
        var BASE_CACHE_FIELDS = 10;
        var info = {};
        if (!rawInfo || rawInfo.length < BASE_CACHE_FIELDS){
            return (utils.is_function(callback) ? callback(null) : null);
        }

        var makerProportionOfFee = abi.unfix(rawInfo[1]);
        var tradingFee = abi.unfix(rawInfo[3]);
        var makerFee = tradingFee.times(makerProportionOfFee);
        var descr_length = parseInt(rawInfo[11]);

        info = {
            makerFee: makerFee.toFixed(),
            takerFee: new BigNumber("1.5").times(tradingFee).minus(makerFee).toFixed(),
            tradingPeriod: abi.number(rawInfo[2]),
            tradingFee: abi.unfix(rawInfo[3], "string"),
            creationTime: parseInt(rawInfo[4]),
            volume: abi.unfix(rawInfo[5], "string"),
            tags: [
                this.decodeTag(rawInfo[6]),
                this.decodeTag(rawInfo[7]),
                this.decodeTag(rawInfo[8])
            ],
            endDate: parseInt(rawInfo[9]),
            description: null
        };

        // convert description byte array to unicode
        try {
            info.description = abi.bytes_to_utf16(rawInfo.slice(11));
        } catch (exc) {
            if (this.options.debug.broadcast) console.error(exc, rawInfo);
            info.description = "";
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
