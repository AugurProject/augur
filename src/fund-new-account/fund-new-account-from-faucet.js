"use strict";

var NODE_JS = typeof process !== "undefined" && process.nextTick && !process.browser;

var async = require("async");
var request = (NODE_JS) ? require("request") : require("browser-request");
var abi = require("augur-abi");
var constants = require("../constants");
var noop = require("../utils/noop");

request = request.defaults({timeout: 999999});

module.exports = function (registeredAddress, branch, onSent, onSuccess, onFailed) {
  var onSentCallback, onSuccessCallback, onFailedCallback, url, self = this;
  onSentCallback = onSent || noop;
  onSuccessCallback = onSuccess || noop;
  onFailedCallback = onFailed || noop;
  if (registeredAddress === undefined || registeredAddress === null || registeredAddress.constructor !== String) {
    return onFailed(registeredAddress);
  }
  url = constants.FAUCET + abi.format_address(registeredAddress);
  if (this.options.debug.accounts) console.debug("fundNewAccountFromFaucet:", url);
  request(url, function (err, response, body) {
    if (self.options.debug.accounts) {
      console.log("faucet err:", err);
      console.log("faucet response:", response);
      console.log("faucet body:", body);
    }
    if (err) return onFailed(err);
    if (response.statusCode !== 200) {
      return onFailed(response.statusCode);
    }
    if (self.options.debug.accounts) console.debug("Sent ether to:", registeredAddress);
    self.rpc.balance(registeredAddress, function (ethBalance) {
      var balance;
      if (self.options.debug.accounts) console.debug("Balance:", ethBalance);
      balance = parseInt(ethBalance, 16);
      if (balance > 0) {
        self.fundNewAccount({
          branch: branch || constants.DEFAULT_BRANCH_ID,
          onSent: onSentCallback,
          onSuccess: onSuccessCallback,
          onFailed: onFailedCallback
        });
      } else {
        async.until(function () {
          return balance > 0;
        }, function (callback) {
          self.rpc.waitForNextBlocks(1, function (nextBlock) {
            if (self.options.debug.accounts) console.log("Block:", nextBlock);
            self.rpc.balance(registeredAddress, function (ethBalance) {
              if (self.options.debug.accounts) console.debug("Balance:", ethBalance);
              balance = parseInt(ethBalance, 16);
              callback(null, balance);
            });
          });
        }, function (e) {
          if (e) console.error(e);
          self.fundNewAccount({
            branch: branch || constants.DEFAULT_BRANCH_ID,
            onSent: onSentCallback,
            onSuccess: onSuccessCallback,
            onFailed: onFailedCallback
          });
        });
      }
    });
  });
};
