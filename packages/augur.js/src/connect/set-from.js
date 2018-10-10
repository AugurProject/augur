"use strict";

function setFrom(functionsAbi, fromAddress) {
  if (!fromAddress || !functionsAbi) return functionsAbi;
  for (var contract in functionsAbi) {
    if (functionsAbi.hasOwnProperty(contract)) {
      for (var method in functionsAbi[contract]) {
        if (functionsAbi[contract].hasOwnProperty(method)) {
          functionsAbi[contract][method].from = fromAddress;
        }
      }
    }
  }
  return functionsAbi;
}

module.exports = setFrom;
