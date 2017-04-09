"use strict";

var clone = require("clone");

module.exports = function (contractsAPI, action) {
  if (typeof contractsAPI === "undefined") {
    return {};
  }
  switch (action.type) {
    case "SET_CONTRACTS_API":
      return clone(action.contractsAPI);
    case "CLEAR_CONTRACTS_API":
      return {};
    default:
      return contractsAPI;
  }
};
