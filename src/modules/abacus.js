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
var constants = require("../constants");

BigNumber.config({
    MODULO_MODE: BigNumber.EUCLID,
    ROUNDING_MODE: BigNumber.ROUND_HALF_DOWN
});

var ONE = new BigNumber("1", 10);
var ONE_POINT_FIVE = new BigNumber("1.5", 10);

module.exports = {

    /**
     * @param tradingfee BigNumber
     * @param price BigNumber
     * @param range BigNumber
     * @returns BigNumber
     */
    calculateAdjustedTradingFee: function (tradingFee, price, range) {
        return tradingFee.times(4).times(price).times(ONE.minus(price.dividedBy(range))).dividedBy(range);
    },

    // Calculates adjusted total trade cost at a specified price
    // @returns {BigNumbers}
    calculateTradingCost: function (amount, price, tradingFee, makerProportionOfFee, range) {
        var bnAmount = abi.bignum(amount);
        var bnPrice = abi.bignum(price);
        var percentFee = this.calculateAdjustedTradingFee(abi.bignum(tradingFee), bnPrice, abi.bignum(range));
        var takerFee = ONE_POINT_FIVE.minus(abi.bignum(makerProportionOfFee));
        var fee = takerFee.times(percentFee.times(bnAmount).times(bnPrice));
        var noFeeCost = bnAmount.times(bnPrice);
        return {
            fee: fee,
            percentFee: takerFee,
            cost: noFeeCost.plus(fee),
            cash: noFeeCost.minus(fee)
        };
    },

    // type: "buy" or "sell"
    // gasLimit (optional): block gas limit as an integer
    maxOrdersPerTrade: function (type, gasLimit) {
        return 1 + ((gasLimit || constants.DEFAULT_GAS) - constants.TRADE_GAS[0][type]) / constants.TRADE_GAS[1][type] >> 0;
    },

    // tradeTypes: array of "buy" and/or "sell"
    sumTradeGas: function (tradeTypes) {
        var gas = 0;
        for (var i = 0, n = tradeTypes.length; i < n; ++i) {
            gas += constants.TRADE_GAS[Number(!!i)][tradeTypes[i]];
        }
        return gas;
    },

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
        var tradingFee = abi.bignum(takerFee).plus(bnMakerFee).dividedBy(ONE_POINT_FIVE);
        var makerProportionOfFee = bnMakerFee.dividedBy(tradingFee);
        return {tradingFee: tradingFee, makerProportionOfFee: makerProportionOfFee};
    },

    // expects fixed-point inputs if !isUnfixed
    calculateMakerTakerFees: function (tradingFee, makerProportionOfFee, isUnfixed, returnBigNumber) {
        var bnTradingFee, bnMakerProportionOfFee, makerFee;
        if (!isUnfixed) {
            bnTradingFee = abi.unfix(tradingFee);
            bnMakerProportionOfFee = abi.unfix(makerProportionOfFee);
        } else {
            bnTradingFee = abi.bignum(tradingFee);
            bnMakerProportionOfFee = abi.bignum(makerProportionOfFee);
        }
        makerFee = bnTradingFee.times(bnMakerProportionOfFee);
        if (returnBigNumber) {
            return {
                trading: bnTradingFee,
                maker: makerFee,
                taker: ONE_POINT_FIVE.times(bnTradingFee).minus(makerFee)
            };
        }
        return {
            trading: bnTradingFee.toFixed(),
            maker: makerFee.toFixed(),
            taker: ONE_POINT_FIVE.times(bnTradingFee).minus(makerFee).toFixed()
        };
    },

    parseMarketInfo: function (rawInfo) {
        var EVENTS_FIELDS = 7;
        var OUTCOMES_FIELDS = 3;
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
            var fees = this.calculateMakerTakerFees(rawInfo[4], rawInfo[1]);
            info = {
                network: this.network_id,
                makerFee: fees.maker,
                takerFee: fees.taker,
                tradingFee: fees.trading,
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
            var outcome;
            if (parseInt(rawInfo[index + 2], 16) !== 0) {
                outcome = abi.unfix(abi.hex(rawInfo[index + 2], true), "string");
            }
            var event = {
                id: rawInfo[index],
                endDate: parseInt(rawInfo[index + 1], 16),
                outcome: outcome,
                minValue: abi.unfix(abi.hex(rawInfo[index + 3], true), "string"),
                maxValue: abi.unfix(abi.hex(rawInfo[index + 4], true), "string"),
                numOutcomes: parseInt(rawInfo[index + 5], 16),
                isEthical: abi.unfix(abi.hex(rawInfo[index + 6], true), "number") || undefined
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
                    price: abi.unfix(rawInfo[i*OUTCOMES_FIELDS + index + 1], "string"),
                    sharesPurchased: abi.unfix(rawInfo[i*OUTCOMES_FIELDS + index + 2], "string")
                };
            }
            index += info.numOutcomes*OUTCOMES_FIELDS;

            // convert description byte array to unicode
            var descriptionLength = parseInt(rawInfo[index], 16);
            ++index;
            if (descriptionLength) {
                info.description = abi.bytes_to_utf16(rawInfo.slice(index, index + descriptionLength));
                index += descriptionLength;
            }

            // convert resolution byte array to unicode
            var resolutionLength = parseInt(rawInfo[index], 16);
            ++index;
            if (resolutionLength) {
                info.resolution = abi.bytes_to_utf16(rawInfo.slice(index, index + resolutionLength));
                index += resolutionLength;
            }

            // convert extraInfo byte array to unicode
            var extraInfoLength = parseInt(rawInfo[index], 16);
            if (extraInfoLength) {
                info.extraInfo = abi.bytes_to_utf16(rawInfo.slice(rawInfo.length - extraInfoLength));
            }
        }
        return info;
    },

    formatTags: function (tags) {
        var formattedTags = clone(tags);
        if (!formattedTags || formattedTags.constructor !== Array) formattedTags = [];
        if (formattedTags.length) {
            for (var i = 0; i < formattedTags.length; ++i) {
                if (formattedTags[i] === null || formattedTags[i] === undefined || formattedTags[i] === "") {
                    formattedTags[i] = "0x0";
                } else {
                    formattedTags[i] = abi.short_string_to_int256(formattedTags[i]);
                }
            }
        }
        while (formattedTags.length < 3) {
            formattedTags.push("0x0");
        }
        return formattedTags;
    },

    calculateRequiredMarketValue: function (gasPrice) {
        gasPrice = abi.bignum(gasPrice);
        return abi.prefix_hex((new BigNumber("1200000").times(gasPrice).plus(new BigNumber("500000").times(gasPrice))).toString(16));
    },

    // expects BigNumber inputs
    calculatePriceDepth: function (liquidity, startingQuantity, bestStartingQuantity, halfPriceWidth, minValue, maxValue) {
        return startingQuantity.times(minValue.plus(maxValue).minus(halfPriceWidth)).dividedBy(liquidity.minus(new BigNumber(2).times(bestStartingQuantity)));
    },

    shrinkScalarPrice: function (minValue, price) {
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.minus(minValue).toFixed();
    },

    expandScalarPrice: function (minValue, price) {
        if (minValue.constructor !== BigNumber) minValue = abi.bignum(minValue);
        if (price.constructor !== BigNumber) price = abi.bignum(price);
        return price.plus(minValue).toFixed();
    },

    parseTradeInfo: function (trade) {
        var type, round, roundingMode;
        if (!trade || !trade.length || !parseInt(trade[0], 16)) return null;

        // 0x1=buy, 0x2=sell
        switch (trade[1]) {
        case "0x1":
            type = "buy";
            round = "floor";
            roundingMode = BigNumber.ROUND_DOWN;
            break;
        case "0x2":
            type = "sell";
            round = "ceil";
            roundingMode = BigNumber.ROUND_UP;
            break;
        default:
            return null;
        }

        var amount = abi.unfix(trade[3]);
        if (amount.lt(constants.MINIMUM_TRADE_SIZE)) return null;
        if (amount.lt(constants.PRECISION.limit)) {
            amount = amount.toPrecision(constants.PRECISION.decimals, BigNumber.ROUND_DOWN);
        } else {
            amount = amount.times(constants.PRECISION.multiple).floor().dividedBy(constants.PRECISION.multiple).toFixed();
        }

        var price = abi.unfix(trade[4]);
        if (price.lt(constants.PRECISION.limit)) {
            price = price.toPrecision(constants.PRECISION.decimals, roundingMode);
        } else {
            price = price.times(constants.PRECISION.multiple)[round]().dividedBy(constants.PRECISION.multiple).toFixed();
        }

        return {
            id: trade[0],
            type: type,
            market: trade[2],
            amount: amount,
            price: price,
            owner: abi.format_address(trade[5], true),
            block: parseInt(trade[6], 16),
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

    base58Decrypt: function (secureLoginID) {
        return JSON.parse(new Buffer(bs58.decode(secureLoginID)).toString('utf8'));
    },

    base58Encrypt: function (keystore) {
        return bs58.encode(new Buffer(JSON.stringify(keystore), "utf8"));
    }
};
