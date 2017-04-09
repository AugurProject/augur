/**
 * Free testnet Ether for new accounts on registration.
 */

"use strict";

var fundNewAccountFromAddress = require("./fund-new-account-from-address");
var fundNewAccountFromFaucet = require("./fund-new-account-from-faucet");

module.exports = function () {
  return {
    fundNewAccountFromAddress: fundNewAccountFromAddress.bind(this),
    fundNewAccountFromFaucet: fundNewAccountFromFaucet.bind(this)
  };
};
