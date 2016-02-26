"use strict";

var BigNumber = require("bignumber.js");
var _ = require("lodash");
var async = require("async");
var abi = require("augur-abi");
var moment = require("moment");
var constants = require("./constants");

var NO = 1;
var YES = 2;
var warned = {};

module.exports = {

  updateProgressModal: function (update, noStep) {
    var self = this;
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
    var state = this.state.progressModal;
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
    if (!wei) return { value: '', unit: 'ether', withUnit: '-' };
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
    if (!outcome.price && outcome.price !== 0) {
      return '-';
    }

    return outcome.price.toFixed(3);
  },

  // assumes price is a BigNumber object
  priceToPercent: function (price) {
    var percent;

    if (!price || price <= 0.001) {
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
      return module.exports.priceToPercent(outcome.normalizedPrice.dividedBy(100));
    }
    else {
      return module.exports.priceToPercent(outcome.normalizedPrice);
    }
  },

  getOutcomeName: function (id, market) {
    var marketType = market.type;
    if (id == constants.INDETERMINATE_OUTCOME) {
      return {
        type: marketType,
        outcome: "indeterminate"
      };
    }
    switch (marketType) {
    case "categorical":
      if (market && market.longDescription && market.longDescription.indexOf("Choices:") > -1) {
        var desc = market.longDescription.split("Choices:");
        var choices = desc[desc.length - 1].split(",");
        if (choices && choices.constructor === Array && choices.length > id - 1) {
            return {type: "categorical", outcome: choices[id - 1].trim()};
        }
        if (!warned[market._id]) {
          warned[market._id] = true;
          console.warn("Market", market._id, "has", market.numOutcomes, "outcomes, but only", choices.length, "choices found.  Using outcome ID", id, "instead of outcome text.");
        }
        return {type: "categorical", outcome: id};
      }
      if (!warned[market._id]) {
        warned[market._id] = true;
        console.warn("Choices not found for market", market._id, ".  Using outcome ID", id, "instead of outcome text.");
      }
      return {type: "categorical", outcome: id};
    case "scalar":
      if (id === NO) return {type: "scalar", outcome: "⇩"};
      return {type: "scalar", outcome: "⇧"};
    case "binary":
      if (id === NO) return {type: "binary", outcome: "No"};
      return {type: "binary", outcome: "Yes"};
    case "combinatorial":
      return {type: "combinatorial"};
    default:
      console.error("unknown type:", market);
    }
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
  getMarketTypeName: function(market) {
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

  getTourMarketKey: function(markets) {
    var finalTourMarketKey,
        price;

    for (var tourMarketKey in markets) {
        if (!markets.hasOwnProperty(tourMarketKey)) continue;
        if (!markets[tourMarketKey].description.length) continue;
        if (markets[tourMarketKey].type === "binary" &&
            markets[tourMarketKey]._id !== '0xd61ea5b5267761db397ad913ca7933c8727f840b0bbecab2dde169ab7ff3aaf' &&
            markets[tourMarketKey]._id !== '-0x4a0aa5d564358bd70031540e0da0c17f2d670a0ad46b6993da68b3e8164ee3cd') {

          finalTourMarketKey = tourMarketKey;
          price = markets[tourMarketKey].outcomes[0].price.times(100).toFixed(1);

          if (price > 0 && price < 100) {
            finalTourMarketKey = tourMarketKey;
            break;
          }
        }
    }

    return finalTourMarketKey;
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
