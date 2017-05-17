"use strict";

var NODE_JS = typeof process !== "undefined" && process.nextTick && !process.browser;

var assign = require("lodash.assign");
var async = require("async");
var abi = require("augur-abi");
var request = (NODE_JS) ? require("request") : require("browser-request");
var api = require("../api");
var rpcInterface = require("../rpc-interface");
var noop = require("../utils/noop");
var constants = require("../constants");

request = request.defaults({ timeout: 999999 });

// { registeredAddress, branch, onSent, onSuccess, onFailed }
function fundNewAccountFromFaucet(p) {
  var onSentCallback, onSuccessCallback, onFailedCallback, url;
  onSentCallback = p.onSent || noop;
  onSuccessCallback = p.onSuccess || noop;
  onFailedCallback = p.onFailed || noop;
  if (p.registeredAddress == null || p.registeredAddress.constructor !== String) {
    return onFailedCallback(p.registeredAddress);
  }
  url = constants.FAUCET + abi.format_address(p.registeredAddress);
  request(url, function (err, response/*, body */) {
    if (err) return onFailedCallback(err);
    if (response.statusCode !== 200) return onFailedCallback(response.statusCode);
    rpcInterface.getBalance(p.registeredAddress, function (ethBalance) {
      var balance = parseInt(ethBalance, 16);
      if (balance > 0) {
        api().Faucets.fundNewAccount(assign({}, p, {
          branch: p.branch || constants.DEFAULT_BRANCH_ID,
          onSent: onSentCallback,
          onSuccess: onSuccessCallback,
          onFailed: onFailedCallback
        }));
      } else {
        async.until(function () {
          return balance > 0;
        }, function (callback) {
          rpcInterface.waitForNextBlocks(1, function (/* nextBlock */) {
            rpcInterface.getBalance(p.registeredAddress, function (ethBalance) {
              balance = parseInt(ethBalance, 16);
              callback(null, balance);
            });
          });
        }, function (e) {
          if (e) console.error(e);
          api().Faucets.fundNewAccount(assign({}, p, {
            branch: p.branch || constants.DEFAULT_BRANCH_ID,
            onSent: onSentCallback,
            onSuccess: onSuccessCallback,
            onFailed: onFailedCallback
          }));
        });
      }
    });
  });
}

module.exports = fundNewAccountFromFaucet;
