"use strict";

function setContracts(networkID, allContracts) {
  if (!allContracts.hasOwnProperty(networkID)) return {};
  return allContracts[networkID];
}

module.exports = setContracts;
