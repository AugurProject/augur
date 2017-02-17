/**
 * Augur JavaScript SDK
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var BigNumber = require("bignumber.js");
var clone = require("clone");
var abi = require("augur-abi");
var utils = require("../utilities");

module.exports = {

  createSingleEventMarket: function (branch, description, expDate, minValue, maxValue, numOutcomes, resolution, takerFee, tags, makerFee, extraInfo, onSent, onSuccess, onFailed) {
    var self = this;
    if (branch.constructor === Object) {
      description = branch.description;         // string
      expDate = branch.expDate;
      minValue = branch.minValue;               // integer (1 for binary)
      maxValue = branch.maxValue;               // integer (2 for binary)
      numOutcomes = branch.numOutcomes;         // integer (2 for binary)
      resolution = branch.resolution;
      takerFee = branch.takerFee;
      tags = branch.tags;
      makerFee = branch.makerFee;
      extraInfo = branch.extraInfo;
      onSent = branch.onSent;                   // function
      onSuccess = branch.onSuccess;             // function
      onFailed = branch.onFailed;               // function
      branch = branch.branch;               // sha256 hash
    }
    var formattedTags = this.formatTags(tags);
    var fees = this.calculateTradingFees(makerFee, takerFee);
    expDate = parseInt(expDate);
    if (description) description = description.trim();
    if (resolution) resolution = resolution.trim();
    var tx = clone(this.tx.CreateMarket.createSingleEventMarket);
    tx.params = [
      branch,
      description,
      expDate,
      abi.fix(minValue, "hex"),
      abi.fix(maxValue, "hex"),
      numOutcomes,
      resolution || "",
      abi.fix(fees.tradingFee, "hex"),
      formattedTags[0],
      formattedTags[1],
      formattedTags[2],
      abi.fix(fees.makerProportionOfFee, "hex"),
      extraInfo || ""
    ];
    if (!utils.is_function(onSent)) {
      var gasPrice = this.rpc.getGasPrice();
      tx.gasPrice = gasPrice;
      tx.value = this.calculateRequiredMarketValue(gasPrice);
      return this.transact(tx);
    }
    this.rpc.getGasPrice(function (gasPrice) {
      tx.gasPrice = gasPrice;
      tx.value = self.calculateRequiredMarketValue(gasPrice);
      self.transact(tx, onSent, onSuccess, onFailed);
    });
  },

  createEvent: function (branch, description, expDate, minValue, maxValue, numOutcomes, resolution, onSent, onSuccess, onFailed) {
    if (branch.constructor === Object) {
      description = branch.description;         // string
      minValue = branch.minValue;               // integer (1 for binary)
      maxValue = branch.maxValue;               // integer (2 for binary)
      numOutcomes = branch.numOutcomes;         // integer (2 for binary)
      expDate = branch.expDate;
      resolution = branch.resolution;
      onSent = branch.onSent;                   // function
      onSuccess = branch.onSuccess;             // function
      onFailed = branch.onFailed;               // function
      branch = branch.branch;               // sha256 hash
    }
    var tx = clone(this.tx.CreateMarket.createEvent);
    if (description) description = description.trim();
    if (resolution) resolution = resolution.trim();
    tx.params = [
      branch,
      description,
      parseInt(expDate),
      abi.fix(minValue, "hex"),
      abi.fix(maxValue, "hex"),
      numOutcomes,
      resolution || ""
    ];
    return this.transact(tx, onSent, onSuccess, onFailed);
  },

  createMarket: function (branch, takerFee, event, tags, makerFee, extraInfo, onSent, onSuccess, onFailed) {
    var self = this;
    if (branch.constructor === Object) {
      takerFee = branch.takerFee;
      event = branch.event;
      tags = branch.tags;
      makerFee = branch.makerFee;
      extraInfo = branch.extraInfo;
      onSent = branch.onSent;
      onSuccess = branch.onSuccess;
      onFailed = branch.onFailed;
      branch = branch.branch;
    }
    var formattedTags = this.formatTags(tags);
    var fees = this.calculateTradingFees(makerFee, takerFee);
    var tx = clone(this.tx.CreateMarket.createMarket);
    tx.params = [
      branch,
      abi.fix(fees.tradingFee, "hex"),
      event,
      formattedTags[0],
      formattedTags[1],
      formattedTags[2],
      abi.fix(fees.makerProportionOfFee, "hex"),
      extraInfo || ""
    ];
    if (!utils.is_function(onSent)) {
      var gasPrice = this.rpc.getGasPrice();
      tx.gasPrice = gasPrice;
      tx.value = this.calculateRequiredMarketValue(gasPrice);
      return this.transact(tx);
    }
    this.rpc.getGasPrice(function (gasPrice) {
      tx.gasPrice = gasPrice;
      tx.value = self.calculateRequiredMarketValue(gasPrice);
      self.transact(tx, onSent, onSuccess, onFailed);
    });
  },

  updateTradingFee: function (branch, market, takerFee, makerFee, onSent, onSuccess, onFailed) {
    var self = this;
    if (branch.constructor === Object) {
      market = branch.market;         // string
      takerFee = branch.takerFee;
      makerFee = branch.makerFee;
      onSent = branch.onSent;         // function
      onSuccess = branch.onSuccess;   // function
      onFailed = branch.onFailed;     // function
      branch = branch.branch;     // sha256 hash
    }
    var tx = clone(this.tx.CreateMarket.updateTradingFee);
    var fees = this.calculateTradingFees(makerFee, takerFee);
    tx.params = [
      branch,
      market,
      abi.fix(fees.tradingFee, "hex"),
      abi.fix(fees.makerProportionOfFee, "hex"),
    ];
    if (!utils.is_function(onSent)) return this.transact(tx);
    self.transact(tx, onSent, onSuccess, onFailed);
  }
};
