"use strict";

var BigNumber = require("bignumber.js");
var noop = require("../../src/utils/noop");
var constants = require("../../src/constants");

function approveAugurEternalApprovalValue(augur, address, callback) {
  var augurContract = augur.contracts.addresses[augur.rpc.getNetworkID()].Augur;
  augur.api.Cash.allowance({ _owner: address, _spender: augurContract }, function (err, allowance) {
    if (err) return callback(err);
    if (new BigNumber(allowance, 10).eq(new BigNumber(constants.ETERNAL_APPROVAL_VALUE, 16))) return callback(null);
    augur.api.Cash.approve({
      _spender: augurContract,
      _value: constants.ETERNAL_APPROVAL_VALUE,
      onSent: noop,
      onSuccess: function (res) {
        console.log("Augur.approve success:", address, res.callReturn, res.hash);
        callback(null);
      },
      onFailed: function (err) {
        console.error("Augur.approve failed:", address, err);
        callback(err);
      },
    });
  });
}

module.exports = approveAugurEternalApprovalValue;
