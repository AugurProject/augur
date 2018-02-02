/**
 * Client-side / in-browser accounts.
 */

"use strict";

var keythereum = require("keythereum");
var ROUNDS = require("../constants").ROUNDS;

keythereum.constants.pbkdf2.c = ROUNDS;
keythereum.constants.scrypt.n = ROUNDS;

module.exports = {
  getAccountTransferHistory: require("./get-account-transfer-history"),
  importAccount: require("./import-account"),
  login: require("./login"),
  loginWithMasterKey: require("./login-with-master-key"),
  logout: require("./logout"),
  register: require("./register"),
  approveAugur: require('./approve-augur')
};
