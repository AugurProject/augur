"use strict";

var abi = require("augur-abi");
var rpcInterface = require("../../rpc-interface");

/**
 * Calculates (approximately) gas needed to run the transaction
 *
 * @param {Object} tx
 * @param {Number} gasPrice
 * @return {BigNumber}
 */
function getTxGasEth(tx, gasPrice) {
  tx.gasLimit = tx.gas || rpcInterface.constants.DEFAULT_GAS;
  tx.gasPrice = gasPrice;
  return abi.unfix(abi.bignum(tx.gasLimit).times(abi.bignum(gasPrice)));
}

module.exports = getTxGasEth;
