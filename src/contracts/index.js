"use strict";

var contracts = require("augur-contracts");
var generateAbiMap = require("./generate-abi-map");

contracts.abi = generateAbiMap(contracts.abi);

module.exports = contracts;
