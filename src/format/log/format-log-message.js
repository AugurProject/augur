"use strict";

var abi = require("augur-abi");
var clone = require("clone");
var decodeTag = require("../tag/decode-tag");
var formatTradeType = require("./format-trade-type");
var formatCommonFields = require("./format-common-fields");

var formatLogMessage = function (label, msg) {
  var fmt;
  switch (label) {
    case "Approval":
      fmt = clone(msg);
      fmt._owner = abi.format_address(msg._owner);
      fmt._spender = abi.format_address(msg._spender);
      fmt.value = abi.unfix(msg.value);
      return fmt;
    case "collectedFees":
      fmt = formatCommonFields(msg);
      fmt.cashFeesCollected = abi.unfix_signed(msg.cashFeesCollected, "string");
      fmt.newCashBalance = abi.unfix(msg.newCashBalance, "string");
      fmt.lastPeriodRepBalance = abi.unfix(msg.lastPeriodRepBalance, "string");
      fmt.repGain = abi.unfix_signed(msg.repGain, "string");
      fmt.newRepBalance = abi.unfix(msg.newRepBalance, "string");
      fmt.notReportingBond = abi.unfix(msg.notReportingBond, "string");
      fmt.totalReportingRep = abi.unfix(msg.totalReportingRep, "string");
      fmt.period = parseInt(msg.period, 16);
      return fmt;
    case "completeSets_logReturn":
      fmt = formatCommonFields(msg);
      fmt.numOutcomes = parseInt(msg.numOutcomes, 16);
      fmt.amount = abi.unfix(msg.returnValue, "string");
      return fmt;
    case "deposit":
      fmt = formatCommonFields(msg);
      fmt.value = abi.unfix(msg.value, "string");
      return fmt;
    case "fundedAccount":
      fmt = formatCommonFields(msg);
      fmt.cashBalance = abi.unfix(msg.cashBalance, "string");
      fmt.repBalance = abi.unfix(msg.repBalance, "string");
      return fmt;
    case "log_add_tx":
      fmt = formatCommonFields(msg);
      fmt.outcome = parseInt(msg.outcome, 16);
      fmt.isShortAsk = Boolean(parseInt(msg.isShortAsk, 16));
      return fmt;
    case "log_cancel":
      fmt = formatCommonFields(msg);
      fmt.outcome = parseInt(msg.outcome, 16);
      fmt.cashRefund = abi.unfix(msg.cashRefund, "string");
      return fmt;
    case "log_fill_tx":
    case "log_short_fill_tx":
      fmt = formatCommonFields(msg);
      if (!fmt.type) {
        fmt.type = "sell";
        fmt.isShortSell = true;
      }
      fmt.owner = abi.format_address(msg.owner); // maker
      fmt.takerFee = abi.unfix(msg.takerFee, "string");
      fmt.makerFee = abi.unfix(msg.makerFee, "string");
      fmt.onChainPrice = abi.unfix_signed(msg.onChainPrice, "string");
      fmt.outcome = parseInt(msg.outcome, 16);
      return fmt;
    case "marketCreated":
      fmt = formatCommonFields(msg);
      fmt.marketCreationFee = abi.unfix(msg.marketCreationFee, "string");
      fmt.eventBond = abi.unfix(msg.eventBond, "string");
      fmt.topic = decodeTag(msg.topic);
      return fmt;
    case "payout":
      fmt = formatCommonFields(msg);
      fmt.cashPayout = abi.unfix(msg.cashPayout, "string");
      fmt.cashBalance = abi.unfix(msg.cashBalance, "string");
      fmt.shares = abi.unfix(msg.shares, "string");
      return fmt;
    case "penalizationCaughtUp":
      fmt = formatCommonFields(msg);
      fmt.penalizedFrom = parseInt(msg.penalizedFrom, 16);
      fmt.penalizedUpTo = parseInt(msg.penalizedUpTo, 16);
      fmt.repLost = abi.unfix_signed(msg.repLost).neg().toFixed();
      fmt.newRepBalance = abi.unfix(msg.newRepBalance, "string");
      return fmt;
    case "penalize":
      fmt = formatCommonFields(msg);
      fmt.oldrep = abi.unfix(msg.oldrep, "string");
      fmt.repchange = abi.unfix_signed(msg.repchange, "string");
      fmt.p = abi.unfix(msg.p, "string");
      fmt.penalizedUpTo = parseInt(msg.penalizedUpTo, 16);
      return fmt;
    case "sentCash":
    case "Transfer":
      fmt = clone(msg);
      fmt._from = abi.format_address(msg._from);
      fmt._to = abi.format_address(msg._to);
      fmt._value = abi.unfix(msg._value);
      return fmt;
    case "slashedRep":
      fmt = formatCommonFields(msg);
      fmt.reporter = abi.format_address(msg.reporter);
      fmt.repSlashed = abi.unfix(msg.repSlashed, "string");
      fmt.slasherBalance = abi.unfix(msg.slasherBalance, "string");
      return fmt;
    case "submittedReport":
    case "submittedReportHash":
      fmt = formatCommonFields(msg);
      fmt.ethics = abi.unfix(msg.ethics, "string");
      return fmt;
    case "tradingFeeUpdated":
      fmt = formatCommonFields(msg);
      fmt.tradingFee = abi.unfix(msg.tradingFee, "string");
      return fmt;
    case "withdraw":
      fmt = formatCommonFields(msg);
      fmt.to = abi.format_address(msg.to);
      fmt.value = abi.unfix(msg.value, "string");
      return fmt;
    default:
      return formatCommonFields(msg);
  }
};

module.exports = formatLogMessage;
