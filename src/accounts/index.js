/**
 * Client-side / in-browser accounts.
 */

"use strict";

var keys = require("keythereum");
var accountState = require("./state");
var register = require("./register");
var login = require("./login");
var loginWithMasterKey = require("./login-with-master-key");
var logout = require("./logout");
var importAccount = require("./import-account");
var setAccount = require("./set-account");
var constants = require("../constants");

keys.constants.pbkdf2.c = constants.ROUNDS;
keys.constants.scrypt.n = constants.ROUNDS;

module.exports = function () {
  return {
    account: accountState,
    register: register,
    login: login,
    loginWithMasterKey: loginWithMasterKey,
    logout: logout.bind(this),
    importAccount: importAccount,
    setAccount: setAccount
  };
};
