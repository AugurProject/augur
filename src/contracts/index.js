"use strict";

var assign = require("lodash.assign");
var contracts = require("augur-contracts");
var generateAbiMap = require("./generate-abi-map");

module.exports = assign({}, contracts, { abi: generateAbiMap(contracts.abi) });
