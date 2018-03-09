"use strict";

function setContracts(networkId, allContracts) {
  if (!allContracts.hasOwnProperty(networkId)) return {};
  return allContracts[networkId];
}

module.exports = setContracts;
