/**
 * Augur JavaScript SDK
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var utils = require("../utilities");

module.exports = {

  createSingleEventMarket: function (branch, description, expDate, minValue, maxValue, numOutcomes, resolution, takerFee, tags, makerFee, extraInfo, onSent, onSuccess, onFailed) {
    var formattedTags, fees, tx, gasPrice, self = this;
    if (branch && branch.constructor === Object) {
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
    formattedTags = this.formatTags(tags);
    fees = this.calculateTradingFees(makerFee, takerFee);
    expDate = parseInt(expDate, 10);
    if (description) description = description.trim();
    if (resolution) resolution = resolution.trim();
    tx = clone(this.tx.CreateMarket.createSingleEventMarket);
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
      gasPrice = this.rpc.getGasPrice();
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
    if (branch && branch.constructor === Object) {
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
    if (description) description = description.trim();
    if (resolution) resolution = resolution.trim();
    return this.CreateMarket.createEvent(branch, description, parseInt(expDate, 10), abi.fix(minValue, "hex"), abi.fix(maxValue, "hex"), numOutcomes, resolution || "", onSent, onSuccess, onFailed);
  },

  createMarket: function (branch, takerFee, event, tags, makerFee, extraInfo, onSent, onSuccess, onFailed) {
    var formattedTags, fees, tx, gasPrice, self = this;
    if (branch && branch.constructor === Object) {
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
    formattedTags = this.formatTags(tags);
    fees = this.calculateTradingFees(makerFee, takerFee);
    tx = clone(this.tx.CreateMarket.createMarket);
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
      gasPrice = this.rpc.getGasPrice();
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
    var fees;
    if (branch && branch.constructor === Object) {
      market = branch.market;         // string
      takerFee = branch.takerFee;
      makerFee = branch.makerFee;
      onSent = branch.onSent;         // function
      onSuccess = branch.onSuccess;   // function
      onFailed = branch.onFailed;     // function
      branch = branch.branch;     // sha256 hash
    }
    fees = this.calculateTradingFees(makerFee, takerFee);
    return this.CreateMarket.updateTradingFee(branch, market, abi.fix(fees.tradingFee, "hex"), abi.fix(fees.makerProportionOfFee, "hex"), onSent, onSuccess, onFailed);
  }
};
