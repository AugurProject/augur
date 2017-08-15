"use strict";

var bindContractFunction = require("./bind-contract-function");

function generateContractAPI(functionsABI) {
  return Object.keys(functionsABI).reduce(function (p, contractName) {
    p[contractName] = {};
    Object.keys(functionsABI[contractName]).map(function (functionName) {
      p[contractName][functionName] = bindContractFunction(functionsABI[contractName][functionName]);
    });
    return p;
  }, {});
}

module.exports = generateContractAPI;
