"use strict";

var NODE_JS = typeof process !== "undefined" && process.nextTick && !process.browser;

var async = require("async");
var abi = require("augur-abi");
var request = (NODE_JS) ? require("request") : require("browser-request");
var api = require("../api");
var rpcInterface = require("../rpc-interface");
var noop = require("../utils/noop");
var constants = require("../constants");

request = request.defaults({ timeout: 999999 });

function fundNewAccountFromFaucet(registeredAddress, branch, onSent, onSuccess, onFailed) {
  var onSentCallback, onSuccessCallback, onFailedCallback, url;
  onSentCallback = onSent || noop;
  onSuccessCallback = onSuccess || noop;
  onFailedCallback = onFailed || noop;
  if (registeredAddress == null || registeredAddress.constructor !== String) {
    return onFailed(registeredAddress);
  }
  url = constants.FAUCET + abi.format_address(registeredAddress);
  request(url, function (err, response/*, body */) {
    if (err) return onFailed(err);
    if (response.statusCode !== 200) return onFailed(response.statusCode);
    rpcInterface.getBalance(registeredAddress, function (ethBalance) {
      var balance = parseInt(ethBalance, 16);
      if (balance > 0) {
        api.Faucets.fundNewAccount({
          branch: branch || constants.DEFAULT_BRANCH_ID,
          onSent: onSentCallback,
          onSuccess: onSuccessCallback,
          onFailed: onFailedCallback
        });
      } else {
        async.until(function () {
          return balance > 0;
        }, function (callback) {
          rpcInterface.waitForNextBlocks(1, function (/* nextBlock */) {
            rpcInterface.balance(registeredAddress, function (ethBalance) {
              balance = parseInt(ethBalance, 16);
              callback(null, balance);
            });
          });
        }, function (e) {
          if (e) console.error(e);
          api.Faucets.fundNewAccount({
            branch: branch || constants.DEFAULT_BRANCH_ID,
            onSent: onSentCallback,
            onSuccess: onSuccessCallback,
            onFailed: onFailedCallback
          });
        });
      }
    });
  });
}

module.exports = fundNewAccountFromFaucet;
