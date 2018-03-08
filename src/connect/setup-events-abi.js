"use strict";

function setupEventsAbi(eventsAbi, contracts) {
  if (!contracts || !eventsAbi) return eventsAbi;
  for (var contractName in eventsAbi) {
    if (eventsAbi.hasOwnProperty(contractName)) {
      var contractEventsAbi = eventsAbi[contractName];
      for (var eventName in contractEventsAbi) {
        if (contractEventsAbi.hasOwnProperty(eventName)) {
          eventsAbi[contractName][eventName].address = contracts[contractEventsAbi[eventName].contract];
        }
      }
    }
  }
  return eventsAbi;
}

module.exports = setupEventsAbi;
