"use strict";

var addAllLogsFilter = function (blockStream, contracts) {
  var contractName, contractList;
  contractList = [];
  for (contractName in contracts) {
    if (contracts.hasOwnProperty(contractName)) {
      contractList.push(contracts[contractName]);
    }
  }
  blockStream.addLogFilter({ address: contractList });
};

module.exports = addAllLogsFilter;
