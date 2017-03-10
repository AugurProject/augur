/**
 * Utility functions that do a local calculation (i.e., these functions do not
 * make RPC requests).
 */

"use strict";

var BigNumber = require("bignumber.js");
var clone = require("clone");
var bs58 = require("bs58");
var abi = require("augur-abi");
var utils = require("../utilities");
var constants = require("../constants");
var makeReports = require("./makeReports");

var ONE, ONE_POINT_FIVE, FXP_ONE_POINT_FIVE;

BigNumber.config({
  MODULO_MODE: BigNumber.EUCLID,
  ROUNDING_MODE: BigNumber.ROUND_HALF_DOWN
});

ONE = new BigNumber("1", 10);
ONE_POINT_FIVE = new BigNumber("1.5", 10);
FXP_ONE_POINT_FIVE = abi.fix(ONE_POINT_FIVE);

module.exports = {

  /**
   * 4 * $market_fee * $price * (ONE - $price*ONE/$range) / ($range*ONE)
   * @param tradingfee BigNumber
   * @param price BigNumber
   * @param range BigNumber
   * @return BigNumber
   */
  calculateFxpAdjustedTradingFee: function (tradingFee, price, range) {
    return tradingFee.times(4).times(price).times(
      constants.ONE.minus(price.times(constants.ONE).dividedBy(range).floor())
    ).dividedBy(range.times(constants.ONE)).floor();
  },

  /**
   * 4 * fee * price * (1 - price/range)/range keeps fees lower at the edges
   * @param tradingfee BigNumber
   * @param price BigNumber
   * @param range BigNumber
   * @return BigNumber
   */
  calculateAdjustedTradingFee: function (tradingFee, price, range) {
    return tradingFee.times(4).times(price).times(ONE.minus(price.dividedBy(range))).dividedBy(range);
  },

  // Calculates adjusted total trade cost at a specified price using fixed-point arithmetic
  // @return {BigNumbers}
  calculateFxpTradingCost: function (amount, price, tradingFee, makerProportionOfFee, range) {
    var fxpAmount = abi.fix(amount);
    var fxpPrice = abi.fix(price);
    var adjustedTradingFee = this.calculateFxpAdjustedTradingFee(abi.bignum(tradingFee), fxpPrice, abi.fix(range));
    var takerFee = FXP_ONE_POINT_FIVE.minus(abi.bignum(makerProportionOfFee));
    var fee = takerFee.times(adjustedTradingFee.times(fxpAmount).dividedBy(constants.ONE).floor().times(fxpPrice).dividedBy(constants.ONE).floor()).dividedBy(constants.ONE).floor();
    var noFeeCost = fxpAmount.times(fxpPrice).dividedBy(constants.ONE).floor();
    return {
      fee: abi.unfix(fee),
      percentFee: (noFeeCost.gt(constants.ZERO)) ?
        abi.unfix(fee.dividedBy(noFeeCost).times(constants.ONE).abs()) :
        constants.ZERO,
      cost: abi.unfix(noFeeCost.plus(fee)),
      cash: abi.unfix(noFeeCost.minus(fee))
    };
  },

  // Calculates adjusted total trade cost at a specified price
  // @return {BigNumbers}
  calculateTradingCost: function (amount, price, tradingFee, makerProportionOfFee, range) {
    var bnAmount = abi.bignum(amount);
    var bnPrice = abi.bignum(price);
    var adjustedTradingFee = this.calculateAdjustedTradingFee(abi.bignum(tradingFee), bnPrice, abi.bignum(range));
    var takerFee = ONE_POINT_FIVE.minus(abi.bignum(makerProportionOfFee));
    var fee = takerFee.times(adjustedTradingFee.times(bnAmount).times(bnPrice));
    var noFeeCost = bnAmount.times(bnPrice);
    return {
      fee: fee,
      percentFee: (noFeeCost.gt(constants.ZERO)) ? fee.dividedBy(noFeeCost).abs() : constants.ZERO,
      cost: noFeeCost.plus(fee),
      cash: noFeeCost.minus(fee)
    };
  },

  calculateValidityBond: function (tradingFee, periodLength, baseReporters, numEventsCreatedInPast24Hours, numEventsInReportPeriod) {
    var bnPeriodLength = abi.bignum(periodLength);
    var bnBaseReporters = abi.bignum(baseReporters);
    var bnPast24 = abi.bignum(numEventsCreatedInPast24Hours);
    var bnNumberEvents = abi.bignum(numEventsInReportPeriod);
    var bnGasPrice = abi.bignum(this.rpc.gasPrice || constants.DEFAULT_GASPRICE);
    var creationFee = abi.bignum("0.03").times(bnBaseReporters).dividedBy(tradingFee);
    var minFee = constants.COST_PER_REPORTER.times(bnBaseReporters).times(bnGasPrice);
    if (creationFee.lt(minFee)) creationFee = minFee;
    return creationFee.plus(bnPast24.dividedBy(bnPeriodLength).plus(1))
      .dividedBy(bnNumberEvents.plus(1))
      .dividedBy(2)
      .toFixed();
  },

  // type: "buy" or "sell"
  // gasLimit (optional): block gas limit as an integer
  maxOrdersPerTrade: function (type, gasLimit) {
    return 1 + ((gasLimit || 3135000) - constants.TRADE_GAS[0][type]) / constants.TRADE_GAS[1][type] >> 0;
  },

  // tradeTypes: array of "buy" and/or "sell"
  sumTradeGas: function (tradeTypes) {
    var i, n, gas = 0;
    for (i = 0, n = tradeTypes.length; i < n; ++i) {
      gas += constants.TRADE_GAS[Number(Boolean(i))][tradeTypes[i]];
    }
    return gas;
  },

  sumTrades: function (trade_ids) {
    var i, numTrades, trades = new BigNumber(0);
    for (i = 0, numTrades = trade_ids.length; i < numTrades; ++i) {
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

  calculateFxpTradingFees: function (makerFee, takerFee) {
    var fxpMakerFee, tradingFee, makerProportionOfFee;
    fxpMakerFee = abi.fix(makerFee);
    tradingFee = abi.fix(takerFee).plus(fxpMakerFee).dividedBy(FXP_ONE_POINT_FIVE).times(constants.ONE).floor();
    makerProportionOfFee = fxpMakerFee.dividedBy(tradingFee).times(constants.ONE).floor();
    return {tradingFee: tradingFee, makerProportionOfFee: makerProportionOfFee};
  },

  calculateTradingFees: function (makerFee, takerFee) {
    var bnMakerFee, tradingFee, makerProportionOfFee;
    bnMakerFee = abi.bignum(makerFee);
    tradingFee = abi.bignum(takerFee).plus(bnMakerFee).dividedBy(ONE_POINT_FIVE);
    makerProportionOfFee = bnMakerFee.dividedBy(tradingFee);
    return {tradingFee: tradingFee, makerProportionOfFee: makerProportionOfFee};
  },

  calculateFxpMakerTakerFees: function (tradingFee, makerProportionOfFee) {
    var fxpTradingFee, fxpMakerProportionOfFee, makerFee, takerFee;
    fxpTradingFee = abi.bignum(tradingFee);
    fxpMakerProportionOfFee = abi.bignum(makerProportionOfFee);
    makerFee = fxpTradingFee.times(fxpMakerProportionOfFee).dividedBy(constants.ONE).floor();
    takerFee = ONE_POINT_FIVE.times(fxpTradingFee).dividedBy(constants.ONE).floor().minus(makerFee);
    return {
      trading: fxpTradingFee,
      maker: makerFee,
      taker: takerFee
    };
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
    var EVENTS_FIELDS, OUTCOMES_FIELDS, info, index, fees, topic, fxpConsensusOutcome, unfixed, i, descriptionLength, extraInfoLength, resolutionSourceLength;
    EVENTS_FIELDS = 9;
    OUTCOMES_FIELDS = 3;
    info = {};
    if (rawInfo && rawInfo.length > 15 && rawInfo[0] && rawInfo[4] && rawInfo[7] && rawInfo[8]) {
      // marketInfo[0] = marketID
      // marketInfo[1] = MARKETS.getMakerFees(marketID)
      // marketInfo[2] = numOutcomes
      // marketInfo[3] = MARKETS.getTradingPeriod(marketID)
      // marketInfo[4] = MARKETS.getTradingFee(marketID)
      // marketInfo[5] = MARKETS.getBranchID(marketID)
      // marketInfo[6] = MARKETS.getCumScale(marketID)
      // marketInfo[7] = MARKETS.getCreationTime(marketID)
      // marketInfo[8] = MARKETS.getCreationBlock(marketID)
      // marketInfo[9] = MARKETS.getVolume(marketID)
      // marketInfo[10] = INFO.getCreationFee(marketID)
      // marketInfo[11] = INFO.getCreator(marketID)
      // tags = MARKETS.returnTags(marketID, outitems=3)
      // marketInfo[12] = tags[0]
      // marketInfo[13] = tags[1]
      // marketInfo[14] = tags[2]
      index = 15;
      fees = this.calculateMakerTakerFees(rawInfo[4], rawInfo[1]);
      topic = this.decodeTag(rawInfo[12]);
      info = {
        id: abi.format_int256(rawInfo[0]),
        network: this.network_id,
        makerFee: fees.maker,
        takerFee: fees.taker,
        tradingFee: fees.trading,
        numOutcomes: parseInt(rawInfo[2], 16),
        tradingPeriod: parseInt(rawInfo[3], 16),
        branchID: rawInfo[5],
        cumulativeScale: abi.unfix(rawInfo[6], "string"),
        creationTime: parseInt(rawInfo[7], 16),
        creationBlock: parseInt(rawInfo[8], 16),
        volume: abi.unfix(rawInfo[9], "string"),
        creationFee: abi.unfix(rawInfo[10], "string"),
        author: abi.format_address(rawInfo[11]),
        topic: topic,
        tags: [topic, this.decodeTag(rawInfo[13]), this.decodeTag(rawInfo[14])],
        minValue: abi.unfix_signed(rawInfo[index + 3], "string"),
        maxValue: abi.unfix_signed(rawInfo[index + 4], "string"),
        endDate: parseInt(rawInfo[index + 1], 16),
        eventID: abi.format_int256(rawInfo[index]),
        eventBond: abi.unfix_signed(rawInfo[index + 6], "string")
      };

      // type: binary, categorical, or scalar
      if (info.numOutcomes > 2) {
        info.type = "categorical";
      } else if (info.minValue === "1" && info.maxValue === "2") {
        info.type = "binary";
      } else {
        info.type = "scalar";
      }
      if (parseInt(rawInfo[index + 2], 16) !== 0) {
        fxpConsensusOutcome = rawInfo[index + 2];
        unfixed = makeReports.unfixConsensusOutcome(fxpConsensusOutcome, info.minValue, info.maxValue, info.type);
        info.consensus = {
          outcomeID: unfixed.outcomeID,
          isIndeterminate: unfixed.isIndeterminate,
          isUnethical: !abi.unfix_signed(rawInfo[index + 7], "number")
        };
        if (parseInt(rawInfo[index + 8], 16) !== 0) {
          info.consensus.proportionCorrect = abi.unfix(rawInfo[index + 8], "string");
        }
      } else {
        info.consensus = null;
      }
      index += EVENTS_FIELDS;

      // organize outcome info
      info.outcomes = new Array(info.numOutcomes);
      for (i = 0; i < info.numOutcomes; ++i) {
        info.outcomes[i] = {
          id: i + 1,
          outstandingShares: abi.unfix(rawInfo[i*OUTCOMES_FIELDS + index], "string"),
          price: abi.unfix_signed(rawInfo[i*OUTCOMES_FIELDS + index + 1], "string"),
          sharesPurchased: abi.unfix(rawInfo[i*OUTCOMES_FIELDS + index + 2], "string")
        };
      }
      index += info.numOutcomes*OUTCOMES_FIELDS;

      // convert description byte array to unicode
      descriptionLength = parseInt(rawInfo[index], 16);
      ++index;
      if (descriptionLength) {
        info.description = abi.bytes_to_utf16(rawInfo.slice(index, index + descriptionLength));
        index += descriptionLength;
      }

      // convert resolution byte array to unicode
      resolutionSourceLength = parseInt(rawInfo[index], 16);
      ++index;
      if (resolutionSourceLength) {
        info.resolutionSource = abi.bytes_to_utf16(rawInfo.slice(index, index + resolutionSourceLength));
        index += resolutionSourceLength;
      }

      // convert extraInfo byte array to unicode
      extraInfoLength = parseInt(rawInfo[index], 16);
      if (extraInfoLength) {
        info.extraInfo = abi.bytes_to_utf16(rawInfo.slice(rawInfo.length - extraInfoLength));
      }
    }
    return info;
  },

  formatTag: function (tag) {
    if (tag === null || tag === undefined || tag === "") return "0x0";
    return abi.short_string_to_int256(tag.trim());
  },

  formatTags: function (tags) {
    var i, formattedTags = clone(tags);
    if (!formattedTags || formattedTags.constructor !== Array) formattedTags = [];
    if (formattedTags.length) {
      for (i = 0; i < formattedTags.length; ++i) {
        formattedTags[i] = this.formatTag(formattedTags[i]);
      }
    }
    while (formattedTags.length < 3) {
      formattedTags.push("0x0");
    }
    return formattedTags;
  },

  calculateRequiredMarketValue: function (gasPrice) {
    gasPrice = abi.bignum(gasPrice || constants.DEFAULT_GASPRICE);
    return abi.prefix_hex((new BigNumber("1200000", 10).times(gasPrice).plus(new BigNumber("500000", 10).times(gasPrice))).toString(16));
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

  adjustScalarSellPrice: function (maxValue, price) {
    if (maxValue.constructor !== BigNumber) maxValue = abi.bignum(maxValue);
    if (price.constructor !== BigNumber) price = abi.bignum(price);
    return maxValue.minus(price).toFixed();
  },

  roundToPrecision: function (value, minimum, round, roundingMode) {
    var absValue = value.abs();
    if (absValue.lt(minimum || constants.PRECISION.zero)) return null;
    if (absValue.lt(constants.PRECISION.limit)) {
      value = value.toPrecision(constants.PRECISION.decimals, roundingMode || BigNumber.ROUND_DOWN);
    } else {
      value = value.times(constants.PRECISION.multiple)[round || "floor"]().dividedBy(constants.PRECISION.multiple).toFixed();
    }
    return value;
  },

  parseTradeInfo: function (trade) {
    var type, round, roundingMode, fullPrecisionAmount, amount, fullPrecisionPrice, price;
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

    fullPrecisionAmount = abi.unfix(trade[3]);
    amount = this.roundToPrecision(fullPrecisionAmount, constants.MINIMUM_TRADE_SIZE);
    if (amount === null) return null;

    fullPrecisionPrice = abi.unfix(abi.hex(trade[4], true));
    price = this.roundToPrecision(fullPrecisionPrice, constants.PRECISION.zero, round, roundingMode);
    if (price === null) return null;

    return {
      id: abi.format_int256(trade[0]),
      type: type,
      market: trade[2],
      amount: amount,
      fullPrecisionAmount: fullPrecisionAmount.toFixed(),
      price: price,
      fullPrecisionPrice: fullPrecisionPrice.toFixed(),
      owner: abi.format_address(trade[5]),
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

  base58Decode: function (encoded) {
    return JSON.parse(new Buffer(bs58.decode(encoded)).toString("utf8"));
  },

  base58Encode: function (o) {
    return bs58.encode(new Buffer(JSON.stringify(o), "utf8"));
  }
};
