"use strict";

var BigNumber = require("bignumber.js");
var augurNode = require("../augur-node");
var constants = require("../constants");
var api = require("../api");

/**
 * @param {string} address an account address.
 * @param {{signer: buffer|function, accountType: string}=} auth Authentication metadata for raw transactions.
 * @param {function} callback Called when the check has completed, returns null on success or an error if there was a failure.
 */
function approveAugur(address, auth, callback) {
  augurNode.getContractAddresses(function(err, contractsInfo) {
    if (err) return callback(err);
    var augurContract = contractsInfo.addresses.Augur;
    api().Cash.allowance({ _owner: address, _spender: augurContract }, function (err, allowance) {
      if (err) return callback(err);
      if (new BigNumber(allowance, 10).gte(new BigNumber(constants.ETERNAL_APPROVAL_VALUE, 16))) {
        return callback(null);
      }
      api().Cash.approve({
        meta: auth,
        _spender: augurContract,
        _value: constants.ETERNAL_APPROVAL_VALUE,
        onSent: function () {},
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
  });
}

module.exports = approvalCheck;
