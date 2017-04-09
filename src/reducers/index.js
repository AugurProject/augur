"use strict";

var contractAddresses = require("./contract-addresses");
var contractsAPI = require("./contracts-api");
var coinbaseAddress = require("./coinbase-address");
var fromAddress = require("./from-address");
var activeAccount = require("./active-account");
var subscriptions = require("./subscriptions");

var reducer = function (state, action) {
  return {
    contractAddresses: contractAddresses(state.contractAddresses, action),
    contractsAPI: contractsAPI(state.contractsAPI, action),
    coinbaseAddress: coinbaseAddress(state.coinbaseAddress, action),
    fromAddress: fromAddress(state.fromAddress, action),
    activeAccount: activeAccount(state.activeAccount, action),
    subscriptions: subscriptions(state.subscriptions, action)
  };
};

module.exports = function (state, action) {
  if (action.type === "RESET_STATE") {
    return reducer({}, action);
  }
  return reducer(state || {}, action);
};
