"use strict";

var abi = require("augur-abi");
var api = require("../api");
var isObject = require("../utils/is-object");

function createSubbranch(description, periodLength, parent, minTradingFee, oracleOnly, onSent, onSuccess, onFailed) {
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
  description = description.trim();
  api.CreateBranch.createSubbranch({
    description: description,
    periodLength: periodLength,
    parent: parent,
    minTradingFee: abi.fix(minTradingFee, "hex"),
    oracleOnly: oracleOnly || 0,
    tx: { description: description },
    onSent: onSent,
    onSuccess: onSuccess,
    onFailed: onFailed
  });
}

module.exports = createSubbranch;
