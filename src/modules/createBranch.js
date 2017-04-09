"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var isFunction = require("../utils/is-function");
var sha3 = require("../utils/sha3");

module.exports = {

  createBranch: function (description, periodLength, parent, minTradingFee, oracleOnly, onSent, onSuccess, onFailed) {
    var response, block, self = this;
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
    if (!isFunction(onSent)) {
      response = this.CreateBranch.createSubbranch({
        description: description,
        periodLength: periodLength,
        parent: parent,
        minTradingFee: abi.fix(minTradingFee, "hex"),
        oracleOnly: oracleOnly
      });
      block = this.rpc.getBlock(response.blockNumber);
      response.branchID = sha3([
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
          response.branchID = sha3([
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
    var tx;
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
    tx = clone(this.tx.CreateBranch.createSubbranch);
    tx.params = [
      description,
      periodLength,
      parent,
      abi.fix(minTradingFee, "hex"),
      oracleOnly
    ];
    tx.description = description;
    return this.transact(tx, onSent, onSuccess, onFailed);
  }
};
