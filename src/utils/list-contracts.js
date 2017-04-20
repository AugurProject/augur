"use strict";

module.exports = function (contracts) {
  var contractName, contractList;
  contractList = [];
  for (contractName in contracts) {
    if (contracts.hasOwnProperty(contractName)) {
      contractList.push(contracts[contractName]);
    }
  }
  return contractList;
};
