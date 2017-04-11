"use strict";

var contractAddressesReducer = require("./contract-addresses");
var contractsAPIReducer = require("./contracts-api");
var coinbaseAddressReducer = require("./coinbase-address");
var fromAddressReducer = require("./from-address");
var activeAccountReducer = require("./active-account");
var subscriptionsReducer = require("./subscriptions");

var reducer = function (state, action) {
  return {
    contractAddresses: contractAddressesReducer(state.contractAddresses, action),
    contractsAPI: contractsAPIReducer(state.contractsAPI, action),
    coinbaseAddress: coinbaseAddressReducer(state.coinbaseAddress, action),
    fromAddress: fromAddressReducer(state.fromAddress, action),
    activeAccount: activeAccountReducer(state.activeAccount, action),
    subscriptions: subscriptionsReducer(state.subscriptions, action)
  };
};

module.exports = function (state, action) {
  return reducer(state || {}, action);
};
