"use strict";

module.exports = function (fromAddress, action) {
  if (typeof fromAddress === "undefined") {
    return null;
  }
  switch (action.type) {
    case "SET_FROM_ADDRESS":
      return action.fromAddress;
    case "CLEAR_FROM_ADDRESS":
      return null;
    default:
      return fromAddress;
  }
};
