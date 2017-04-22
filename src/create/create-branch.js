"use strict";

var abi = require("augur-abi");
var rpcInterface = require("../rpc-interface");
var api = require("../api");
var isFunction = require("../utils/is-function");
var sha3 = require("../utils/sha3");
var isObject = require("../utils/is-object");

function createBranch(description, periodLength, parent, minTradingFee, oracleOnly, onSent, onSuccess, onFailed) {
  if (isObject(description)) {
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
  createSubbranch({
    description: description,
    periodLength: periodLength,
    parent: parent,
    minTradingFee: minTradingFee,
    oracleOnly: oracleOnly,
    onSent: onSent,
    onSuccess: function (response) {
      rpcInterface.getBlockByNumber(response.blockNumber, false, function (block) {
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
}

module.exports = createBranch;
