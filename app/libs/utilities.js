"use strict";

var BigNumber = require("bignumber.js");
var _ = require("lodash");
var async = require("async");
var abi = require("augur-abi");
var moment = require("moment");
var constants = require("./constants");

var NO = 1;
var YES = 2;

module.exports = {

  isNumeric: function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },

  // http://stackoverflow.com/a/2901298/2059654
  commafy: function (x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  },

  updateProgressModal: function (update, noStep) {
    var self = this;
    var state = this.state.progressModal;
    if (update === null || update === undefined) {
      state.status = "";
      state.header = "";
      state.detail = null;
      state.complete = null;
      state.step = 0;
    } else {
      if (update.constructor === String) update = {status: update};
      if (update.constructor === Array) {
        return async.eachSeries(update, function (step, next) {
          self.updateProgressModal(step, true);
          next();
        }, function () {
          var state = self.state.progressModal;
          state.step++;
          self.setState({progressModal: state});
        });
      }
      if (update.header) state.header = update.header;
      if (update.detail) state.detail = update.detail;
      if (update.status) {
        update.status = (state.status === "") ?
          update.status : "<br />" + update.status;
        state.status += update.status;
      }
      if (update.complete !== null && update.complete !== undefined) {
        state.complete = update.complete;
      }
      if (!noStep) state.step++;
    }
    this.setState({progressModal: state});
  },

  rotate: function (a) { a.unshift(a.pop()); },

  // calculate date from block number
  blockToDate: function (block, currentBlock) {
    var seconds = (block - currentBlock) * constants.SECONDS_PER_BLOCK;
    var date = moment().add(seconds, 'seconds');
    return date;
  },

  // assuming date is moment for now
  dateToBlock: function (date, currentBlock) {
    var now = moment();
    var secondsDelta = date.diff(now, 'seconds');
    var blockDelta = parseInt(secondsDelta / constants.SECONDS_PER_BLOCK);
    return currentBlock + blockDelta;
  },

  formatEther: function (wei) {
    if (!wei) return {value: '', unit: 'ether', withUnit: '-'};
    if (wei instanceof Error) throw wei;
    var value = abi.bignum(wei).dividedBy(constants.ETHER);
    var unit = 'ether';
    return {
      value: +value.toFixed(2),
      unit: unit,
      withUnit: value.toFixed(2) + ' ' + unit
    };
  },

  bytesToHex: function (bytes) {
    return "0x" + _.reduce(bytes, function (hexString, byte) {
      return hexString + byte.toString(16);
    }, "");
  },

  getOutcomePrice: function (outcome) {
    if (outcome.price === null || outcome.price === undefined) {
      return '-';
    }
    var price = outcome.price.toFixed(3);
    if (price == "-0.000") price = "0.000";
    return price;
  },

  // assumes price is a BigNumber object
  priceToPercent: function (price) {
    var percent;

    if (!price || price.abs() <= 0.001) {
      percent = 0;
    }
    else if (price >= 0.999) {
      percent = 100;
    }
    else {
      percent = price.times(100).toFixed(0);
    }

    return percent + '%';
  },

  getPercentageFormatted: function (market, outcome) {
    if (market.type === "scalar") {
      var price = outcome.price.toFixed(2);
      if (price == "-0.00") price = "0.00";
      return price;
    } else {
      return module.exports.priceToPercent(outcome.normalizedPrice);
    }
  },

  parseOutcomeText: function (id, market) {
    var desc, choices;
    if (market.longDescription &&
        (market.longDescription.indexOf("Choices:") > -1 ||
         market.longDescription.indexOf("~|>") > -1)) {
      id = Number(id);
      if (market.longDescription.indexOf("~|>") > -1) {
        desc = market.longDescription.split("~|>");
        choices = desc[desc.length - 1].split("|");
      } else if (market.longDescription.indexOf("Choices:") > -1) {
        desc = market.longDescription.split("Choices:");
        choices = desc[desc.length - 1].split(",");
      }
      if (id && choices && choices.constructor === Array && choices.length > id - 1) {
        return {type: "categorical", outcome: choices[id - 1].trim()};
      }
      return {type: "categorical", outcome: id};
    } else if (market.type === "binary") {
      if (parseInt(id) === NO) return {type: "binary", outcome: "No"};
      return {type: "binary", outcome: "Yes"};
    }
    return {type: "categorical", outcome: id};
  },

  getOutcomeName: function (id, market) {
    var marketType = market.type;
    if (id == constants.INDETERMINATE_OUTCOME) {
      return {type: market.type, outcome: "indeterminate"};
    }
    var label;
    if (market && market.numOutcomes) {
      for (var i = 0; i < market.numOutcomes; ++i) {
        if (market.outcomes[i].id === Number(id)) {
          label = market.outcomes[i].label;
        }
      }
    }
    if (market.type === "scalar") {
      if (parseInt(id) === NO) return {type: market.type, outcome: "⇩"};
      return {type: market.type, outcome: "⇧"};
    } else if (market.type === "combinatorial") {
      return {type: market.type};
    }
    if (label) return {type: market.type, outcome: label};
    return this.parseOutcomeText(id, market);
  },

  getOutcomeNames: function (market) {
    var numOutcomes = parseInt(market.numOutcomes, 10),
        outcomes = market.outcomes,
        outcomeNames = new Array(numOutcomes),
        outcomeName,
        i;

    for (i = 0; i < numOutcomes; ++i) {
        outcomeName = module.exports.getOutcomeName(outcomes[i].id, market);
        outcomeNames[i] = outcomeName.outcome;
    }

    return outcomeNames;
  },

  getMarketTypeName: function (market) {
    switch (market.type) {
      case "categorical":
          return "Multiple-Choice Market";
      case "scalar":
          return "Numeric Market";
      case "binary":
          return "Yes/No Market";
      default:
          return "Unknown Market";
    }
  },

  // check if account address is correctly formatted
  isValidAccount: function (address) {
    address = address.replace(/^0x/, '');  // strip leading '0x' is it exists
    return address.match(/^[0-9a-fA-F]{40}$/) ? true : false;
  },
  singularOrPlural(value, singular, plural) {
    return Math.abs(value) === 1 ? singular : (plural || `${singular}s`);
  }
};
