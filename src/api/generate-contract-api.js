"use strict";

var bindContractFunction = require("./bind-contract-function");

function generateContractAPI(functionsAbi) {
  return Object.keys(functionsAbi).reduce(function (p, contractName) {
    p[contractName] = {};
    Object.keys(functionsAbi[contractName]).map(function (functionName) {
      p[contractName][functionName] = bindContractFunction(functionsAbi[contractName][functionName]);
    });
    return p;
  }, {});
}

module.exports = generateContractAPI;
