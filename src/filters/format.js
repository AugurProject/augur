"use strict";

var abi = require("augur-abi");
var unrollArray = require("ethrpc").unmarshal;
var clone = require("clone");

module.exports = {

  formatTradeType: function (type) {
    return (parseInt(type, 16) === 1) ? "buy" : "sell";
  },

  formatCommonFields: function (msg) {
    var fmt = clone(msg);
    if (msg.sender) fmt.sender = abi.format_address(msg.sender);
    if (msg.timestamp) fmt.timestamp = parseInt(msg.timestamp, 16);
    if (msg.type) fmt.type = this.formatTradeType(msg.type);
    if (msg.price) fmt.price = abi.unfix_signed(msg.price, "string");
    if (msg.amount) fmt.amount = abi.unfix(msg.amount, "string");
    return fmt;
  },

  formatLogMessage: function (label, msg) {
    var fmt;
    switch (label) {
      case "Approval":
        fmt = clone(msg);
        fmt._owner = abi.format_address(msg._owner);
        fmt._spender = abi.format_address(msg._spender);
        fmt.value = abi.unfix(msg.value);
        return fmt;
      case "collectedFees":
        fmt = this.formatCommonFields(msg);
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
        fmt = this.formatCommonFields(msg);
        fmt.numOutcomes = parseInt(msg.numOutcomes, 16);
        fmt.amount = abi.unfix(msg.returnValue, "string");
        return fmt;
      case "deposit":
        fmt = this.formatCommonFields(msg);
        fmt.value = abi.unfix(msg.value, "string");
        return fmt;
      case "fundedAccount":
        fmt = this.formatCommonFields(msg);
        fmt.cashBalance = abi.unfix(msg.cashBalance, "string");
        fmt.repBalance = abi.unfix(msg.repBalance, "string");
        return fmt;
      case "log_add_tx":
        fmt = this.formatCommonFields(msg);
        fmt.outcome = parseInt(msg.outcome, 16);
        fmt.isShortAsk = Boolean(parseInt(msg.isShortAsk, 16));
        return fmt;
      case "log_cancel":
        fmt = this.formatCommonFields(msg);
        fmt.outcome = parseInt(msg.outcome, 16);
        fmt.cashRefund = abi.unfix(msg.cashRefund, "string");
        return fmt;
      case "log_fill_tx":
      case "log_short_fill_tx":
        fmt = this.formatCommonFields(msg);
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
        fmt = this.formatCommonFields(msg);
        fmt.marketCreationFee = abi.unfix(msg.marketCreationFee, "string");
        fmt.eventBond = abi.unfix(msg.eventBond, "string");
        fmt.topic = augur.decodeTag(msg.topic);
        return fmt;
      case "payout":
        fmt = this.formatCommonFields(msg);
        fmt.cashPayout = abi.unfix(msg.cashPayout, "string");
        fmt.cashBalance = abi.unfix(msg.cashBalance, "string");
        fmt.shares = abi.unfix(msg.shares, "string");
        return fmt;
      case "penalizationCaughtUp":
        fmt = this.formatCommonFields(msg);
        fmt.penalizedFrom = parseInt(msg.penalizedFrom, 16);
        fmt.penalizedUpTo = parseInt(msg.penalizedUpTo, 16);
        fmt.repLost = abi.unfix_signed(msg.repLost).neg().toFixed();
        fmt.newRepBalance = abi.unfix(msg.newRepBalance, "string");
        return fmt;
      case "penalize":
        fmt = this.formatCommonFields(msg);
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
        fmt = this.formatCommonFields(msg);
        fmt.reporter = abi.format_address(msg.reporter);
        fmt.repSlashed = abi.unfix(msg.repSlashed, "string");
        fmt.slasherBalance = abi.unfix(msg.slasherBalance, "string");
        return fmt;
      case "submittedReport":
      case "submittedReportHash":
        fmt = this.formatCommonFields(msg);
        fmt.ethics = abi.unfix(msg.ethics, "string");
        return fmt;
      case "tradingFeeUpdated":
        fmt = this.formatCommonFields(msg);
        fmt.tradingFee = abi.unfix(msg.tradingFee, "string");
        return fmt;
      case "withdraw":
        fmt = this.formatCommonFields(msg);
        fmt.to = abi.format_address(msg.to);
        fmt.value = abi.unfix(msg.value, "string");
        return fmt;
      default:
        return this.formatCommonFields(msg);
    }
  },
 
  parseLogMessage: function (label, msg, onMessage) {
    var i, inputs, parsed, topicIndex, dataIndex, topics, data;
    console.log("parseLogMessage label:", label);
    console.log("parseLogMessage msg:", JSON.stringify(msg, null, 4));
    if (msg) {
      switch (msg.constructor) {
        case Array:
          for (i = 0; i < msg.length; ++i) {
            this.parseLogMessage(label, msg[i], onMessage);
          }
          break;
        case Object:
          if (!msg.error && msg.topics && msg.data) {
            inputs = eventsAPI[label].inputs;
            parsed = {};
            topicIndex = 0;
            dataIndex = 0;
            topics = msg.topics;
            data = unrollArray(msg.data);
            if (data && data.constructor !== Array) data = [data];
            for (i = 0; i < inputs.length; ++i) {
              parsed[inputs[i].name] = 0;
              if (inputs[i].indexed) {
                parsed[inputs[i].name] = topics[topicIndex + 1];
                ++topicIndex;
              } else {
                parsed[inputs[i].name] = data[dataIndex];
                ++dataIndex;
              }
            }
            parsed.blockNumber = parseInt(msg.blockNumber, 16);
            parsed.transactionHash = msg.transactionHash;
            parsed.removed = msg.removed;
            if (!onMessage) {
              return this.formatLogMessage(label, parsed);
            }
            onMessage(this.formatLogMessage(label, parsed));
          }
          break;
        default:
          console.warn("unknown event message:", msg);
      }
    }
  },
 
  parseBlockMessage: function (message, onMessage) {
    var i, len;
    if (message) {
      if (message.length && message.constructor === Array) {
        for (i = 0, len = message.length; i < len; ++i) {
          if (message[i] && message[i].number) {
            onMessage(message[i].number);
          } else {
            onMessage(message[i]);
          }
        }
      } else if (message.number) {
        onMessage(message.number);
      }
    }
  },
 
  parseAllLogsMessage: function (message, onMessage) {
    var i, len;
    if (message && message.length && message.constructor === Array) {
      for (i = 0, len = message.length; i < len; ++i) {
        if (message[i]) {
          if (message[i].constructor === Object && message[i].data) {
            message[i].data = unrollArray(message[i].data);
          }
          onMessage(message[i]);
        }
      }
    }
  }
};
