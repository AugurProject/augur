"use strict";

function setFrom(functionsAbi, fromAddress) {
  var contract, method;
  if (!fromAddress || !functionsAbi) return functionsAbi;
  for (contract in functionsAbi) {
    if (functionsAbi.hasOwnProperty(contract)) {
      for (method in functionsAbi[contract]) {
        if (functionsAbi[contract].hasOwnProperty(method)) {
          functionsAbi[contract][method].from = fromAddress;
        }
      }
    }
  }
  return functionsAbi;
}

module.exports = setFrom;
