/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var utils = require("../utilities");

module.exports = {

  createBranch: function (description, periodLength, parent, minTradingFee, oracleOnly, onSent, onSuccess, onFailed) {
    var self = this;
    if (description && description.parent) {
      periodLength = description.periodLength;
      parent = description.parent;
      minTradingFee = description.minTradingFee;
      oracleOnly = description.oracleOnly;
      onSent = description.onSent;
      onSuccess = description.onSuccess;
      onFailed = description.onFailed;
      description = description.description;
    }
    oracleOnly = oracleOnly || 0;
    description = description.trim();
    if (!utils.is_function(onSent)) {
      var response = this.CreateBranch.createSubbranch({
        description: description,
        periodLength: periodLength,
        parent: parent,
        minTradingFee: abi.fix(minTradingFee, "hex"),
        oracleOnly: oracleOnly
      });
      var block = this.rpc.getBlock(response.blockNumber);
      response.branchID = utils.sha3([
        response.from,
        "0x28c418afbbb5c0000",
        periodLength,
        block.timestamp,
        parent,
        abi.fix(minTradingFee, "hex"),
        oracleOnly,
        description
      ]);
      return response;
    }
    this.createSubbranch({
      description: description,
      periodLength: periodLength,
      parent: parent,
      minTradingFee: minTradingFee,
      oracleOnly: oracleOnly,
      onSent: onSent,
      onSuccess: function (response) {
        self.rpc.getBlock(response.blockNumber, false, function (block) {
          response.branchID = utils.sha3([
            response.from,
            "0x28c418afbbb5c0000",
            periodLength,
            block.timestamp,
            parent,
            abi.fix(minTradingFee, "hex"),
            oracleOnly,
            description
          ]);
          onSuccess(response);
        });
      },
      onFailed: onFailed
    });
  },

  createSubbranch: function (description, periodLength, parent, minTradingFee, oracleOnly, onSent, onSuccess, onFailed) {
    if (description && description.parent) {
      periodLength = description.periodLength;
      parent = description.parent;
      minTradingFee = description.minTradingFee;
      oracleOnly = description.oracleOnly;
      onSent = description.onSent;
      onSuccess = description.onSuccess;
      onFailed = description.onFailed;
      description = description.description;
    }
    oracleOnly = oracleOnly || 0;
    var tx = clone(this.tx.CreateBranch.createSubbranch);
    tx.params = [
      description.trim(),
      periodLength,
      parent,
      abi.fix(minTradingFee, "hex"),
      oracleOnly
    ];
    tx.description = description.trim();
    return this.transact(tx, onSent, onSuccess, onFailed);
  }
};
