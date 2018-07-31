"use strict";

module.exports = function (contracts) {
  return Object.keys(contracts).reduce(function (p, contractName) {
    p[contracts[contractName]] = contractName;
    return p;
  }, {});
};
