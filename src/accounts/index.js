/**
 * Client-side / in-browser accounts.
 */

"use strict";

var keythereum = require("keythereum");
var constants = require("../constants");

keythereum.constants.pbkdf2.c = constants.ROUNDS;
keythereum.constants.scrypt.n = constants.ROUNDS;

module.exports = {
  register: require("./register"),
  login: require("./login"),
  loginWithMasterKey: require("./login-with-master-key"),
  logout: require("./logout"),
  importAccount: require("./import-account")
};
