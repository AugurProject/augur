"use strict";

function setupEventsAbi(eventsAbi, contracts) {
  var contractName, eventName, contractEventsAbi;
  if (!contracts || !eventsAbi) return eventsAbi;
  for (var contractName in eventsAbi) {
    if (eventsAbi.hasOwnProperty(contractName)) {
      contractEventsAbi = eventsAbi[contractName];
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
