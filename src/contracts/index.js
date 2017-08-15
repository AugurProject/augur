"use strict";

var contracts = require("./contracts");
contracts.api = require("./generate-abi-map")();

module.exports = contracts;
