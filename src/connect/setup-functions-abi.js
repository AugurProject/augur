"use strict";

function setupFunctionsAbi(functionsAbi, contracts) {
  if (!contracts || !functionsAbi) return functionsAbi;
  for (var contract in functionsAbi) {
    if (functionsAbi.hasOwnProperty(contract)) {
      for (var method in functionsAbi[contract]) {
        if (functionsAbi[contract].hasOwnProperty(method)) {
          functionsAbi[contract][method].to = contracts[contract];
        }
      }
    }
  }
  return functionsAbi;
}

module.exports = setupFunctionsAbi;
