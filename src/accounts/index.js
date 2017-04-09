/**
 * Client-side / in-browser accounts.
 */

"use strict";

var keys = require("keythereum");
var register = require("./register");
var login = require("./login");
var loginWithMasterKey = require("./login-with-master-key");
var logout = require("./logout");
var importAccount = require("./import-account");
var setActiveAccount = require("./set-active-account");
var constants = require("../constants");

keys.constants.pbkdf2.c = constants.ROUNDS;
keys.constants.scrypt.n = constants.ROUNDS;

module.exports = {
  register: register,
  login: login,
  loginWithMasterKey: loginWithMasterKey,
  logout: logout,
  importAccount: importAccount,
  setActiveAccount: setActiveAccount
};
