"use strict";

var abi = require("augur-abi");
var api = require("../api");
var isObject = require("../utils/is-object");

function depositEther(value, onSent, onSuccess, onFailed) {
  if (isObject(value)) {
    onSent = value.onSent;
    onSuccess = value.onSuccess;
    onFailed = value.onFailed;
    value = value.value;
  }
  return api().Cash.depositEther({
    tx: { value: abi.fix(value, "hex") },
    onSent: onSent,
    onSuccess: onSuccess,
    onFailed: onFailed
  });
}

module.exports = depositEther;
