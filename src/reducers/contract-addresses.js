"use strict";

var clone = require("clone");

module.exports = function (contractAddresses, action) {
  if (typeof contractAddresses === "undefined") {
    return {};
  }
  switch (action.type) {
    case "SET_CONTRACT_ADDRESSES":
      return clone(action.contractAddresses);
    case "CLEAR_CONTRACT_ADDRESSES":
      return {};
    default:
      return contractAddresses;
  }
};
