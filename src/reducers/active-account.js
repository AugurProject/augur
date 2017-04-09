"use strict";

var clone = require("clone");

module.exports = function (activeAccount, action) {
  if (typeof activeAccount === "undefined") {
    return {};
  }
  switch (action.type) {
    case "SET_ACTIVE_ACCOUNT":
      return clone(action.account);
    case "CLEAR_ACTIVE_ACCOUNT":
      return {};
    default:
      return activeAccount;
  }
};
