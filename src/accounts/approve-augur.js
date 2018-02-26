"use strict";

var BigNumber = require("bignumber.js");
var immutableDelete = require("immutable-delete");
var augurNode = require("../augur-node");
var constants = require("../constants");
var api = require("../api");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.address an account address.
 * @param {{signer: buffer|function, accountType: string}=} p.meta Authentication metadata for raw transactions.
 * @param {function} p.onSent Called when the transaction is broadcast to the network.
 * @param {function} p.onSuccess Called if the transaction completes successfully.
 * @param {function} p.onFailed Called if the transaction fails.
 */
function approveAugur(p) {
  augurNode.getContractAddresses(function (err, contractsInfo) {
    if (err) return p.onFailed(err);
    var augurContract = contractsInfo.addresses.Augur;
    api().Cash.allowance({ _owner: p.address, _spender: augurContract }, function (err, allowance) {
      if (err) return p.onFailed(err);
      if (new BigNumber(allowance, 10).gte(new BigNumber(constants.ETERNAL_APPROVAL_VALUE, 16))) {
        return p.onSuccess(null);
      }
      api().Cash.approve(Object.assign({}, immutableDelete(p, "address"), {
        _spender: augurContract,
        _value: constants.ETERNAL_APPROVAL_VALUE,
      }));
    });
  });
}

module.exports = approveAugur;
