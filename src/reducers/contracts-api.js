"use strict";

var assign = require("lodash.assign");

var initialState = {};

module.exports = function (contractsAPI, action) {
  if (typeof contractsAPI === "undefined") {
    return initialState;
  }
  switch (action.type) {
    case "SET_CONTRACTS_API":
      return action.contractsAPI;
    case "SET_FUNCTIONS_API":
      return assign({}, contractsAPI, { functions: action.functionsAPI });
    case "SET_EVENTS_API":
      return assign({}, contractsAPI, { events: action.eventsAPI });
    case "CLEAR_CONTRACTS_API":
      return initialState;
    default:
      return contractsAPI;
  }
};
