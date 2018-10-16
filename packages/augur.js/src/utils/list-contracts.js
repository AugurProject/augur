"use strict";

module.exports = function (contracts) {
  return Object.keys(contracts).map(function (contractName) {
    return contracts[contractName];
  });
};
