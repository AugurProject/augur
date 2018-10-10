"use strict";

module.exports = function (eventsAbi) {
  return Object.keys(eventsAbi).reduce(function (p, contractName) {
    if (!p[contractName]) p[contractName] = {};
    var contractEventsAbi = eventsAbi[contractName];
    Object.keys(contractEventsAbi).forEach(function (eventName) {
      p[contractName][contractEventsAbi[eventName].signature] = eventName;
    });
    return p;
  }, {});
};
