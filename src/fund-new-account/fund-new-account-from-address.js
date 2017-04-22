"use strict";

var api = require("../api/contract-api");
var rpc = require("../rpc-interface");
var noop = require("../utils/noop");
var constants = require("../constants");

function fundNewAccountFromAddress(fromAddress, amount, registeredAddress, branch, onSent, onSuccess, onFailed) {
  var onSentCallback = onSent || noop;
  var onSuccessCallback = onSuccess || noop;
  var onFailedCallback = onFailed || noop;
  rpc.sendEther({
    to: registeredAddress,
    value: amount,
    from: fromAddress,
    onSent: noop,
    onSuccess: function () {
      api.Faucets.fundNewAccount({
        branch: branch || constants.DEFAULT_BRANCH_ID,
        onSent: onSentCallback,
        onSuccess: onSuccessCallback,
        onFailed: onFailedCallback
      });
    },
    onFailed: onFailedCallback
  });
}

module.exports = fundNewAccountFromAddress;
