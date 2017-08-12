"use strict";

var contracts = require("./contracts");

contracts.api = {
  events: require("./events"),
  functions: require("./functions")
};

module.exports = contracts;
