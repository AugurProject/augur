"use strict";

var constants = require("../constants");
var noop = require("../utils/noop");

var fundNewAccountFromAddress = function (fromAddress, amount, registeredAddress, branch, onSent, onSuccess, onFailed) {
  var onSentCallback, onSuccessCallback, onFailedCallback, self = this;
  onSentCallback = onSent || noop;
  onSuccessCallback = onSuccess || noop;
  onFailedCallback = onFailed || noop;
  this.rpc.sendEther({
    to: registeredAddress,
    value: amount,
    from: fromAddress,
    onSent: noop,
    onSuccess: function () {
      self.Faucets.fundNewAccount({
        branch: branch || constants.DEFAULT_BRANCH_ID,
        onSent: onSentCallback,
        onSuccess: onSuccessCallback,
        onFailed: onFailedCallback
      });
    },
    onFailed: onFailedCallback
  });
};

module.exports = fundNewAccountFromAddress;
