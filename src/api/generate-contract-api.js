"use strict";

var bindContractFunction = require("./bind-contract-function");

function generateContractAPI(functionsAPI) {
  return Object.keys(functionsAPI).reduce(function (p, contractName) {
    p[contractName] = {};
    Object.keys(functionsAPI[contractName]).map(function (functionName) {
      p[contractName][functionName] = bindContractFunction(functionsAPI, contractName, functionName);
    });
    return p;
  }, {});
}

module.exports = generateContractAPI;
