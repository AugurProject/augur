"use strict";

module.exports = function (coinbaseAddress, action) {
  if (typeof coinbaseAddress === "undefined") {
    return null;
  }
  switch (action.type) {
    case "SET_COINBASE_ADDRESS":
      return action.coinbaseAddress;
    case "CLEAR_COINBASE_ADDRESS":
      return null;
    default:
      return coinbaseAddress;
  }
};
