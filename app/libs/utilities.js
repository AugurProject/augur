"use strict";

var BigNumber = require("bignumber.js");
var abi = require("augur-abi");
var moment = require("moment");
var constants = require("./constants");

var NO = 1;
var YES = 2;
var warned = {};

module.exports = {

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

  // assumes price is a BigNumber object
  priceToPercent: function (price) {
    var percent = price.times(100).toFixed(2);
    if (price >= 0.999) {
      percent = 100;
    } else if (price <= 0.001) {
      percent = 0;
    } else if (price >= 0.1) {
      percent = price.times(100).toFixed(1);
    }
    return +percent + '%';
  },

  // check if account address is correctly formatted
  isValidAccount: function (address) {
    address = address.replace(/^0x/, '');  // strip leading '0x' is it exists
    return address.match(/^[0-9a-fA-F]{40}$/) ? true : false;
  },

  getPercentageFormatted: function (market, outcome) {
    let price = outcome.price;
    if (price == null) {
      return "0 %";
    }

    if (market.type === "scalar") {
      return +price.toFixed(2);
    } else {
      return +price.times(100).toFixed(1) + " %";
    }
  },

  getOutcomeName: function (id, market) {
    switch (market.type) {
    case "categorical":
      if (market && market.description && market.description.indexOf("Choices:") > -1) {
        var desc = market.description.split("Choices:");
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
      break;
    case "scalar":
      if (id === NO) return {type: "scalar", outcome: "⇩"};
      return {type: "scalar", outcome: "⇧"};
      break;
    case "binary":
      if (id === NO) return {type: "binary", outcome: "No"};
      return {type: "binary", outcome: "Yes"};
    case "combinatorial":
      return {type: "combinatorial"};
    default:
      console.error("unknown type:", market);
    }
  }
};
