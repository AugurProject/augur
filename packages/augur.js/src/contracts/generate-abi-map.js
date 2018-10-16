"use strict";

var hashEventAbi = require("../events/hash-event-abi");

function generateAbiMap(abi) {
  var functions = {};
  var events = {};
  Object.keys(abi).forEach(function (contractName) {
    var functionsAndEventsArray = abi[contractName];
    functionsAndEventsArray.forEach(function (functionOrEvent) {
      var name = functionOrEvent.name;
      if (functionOrEvent.type === "function") {
        var functionAbiMap = {
          constant: functionOrEvent.constant,
          name: functionOrEvent.name,
        };
        var inputs = [];
        var signature = [];
        if (functionOrEvent.inputs) {
          functionOrEvent.inputs.forEach(function (input) {
            inputs.push(input.name);
            signature.push(input.type);
          });
        }
        if (inputs.length) functionAbiMap.inputs = inputs;
        if (signature.length) functionAbiMap.signature = signature;
        if (functionOrEvent.outputs && functionOrEvent.outputs.length) {
          var output = functionOrEvent.outputs[0];
          functionAbiMap.returns = output.type;
        } else {
          functionAbiMap.returns = "null";
        }
        if (!functions[contractName]) functions[contractName] = {};
        functions[contractName][name] = functionAbiMap;
      } else if (functionOrEvent.type === "event") {
        if (!events[contractName]) events[contractName] = {};
        events[contractName][name] = {
          contract: contractName,
          inputs: functionOrEvent.inputs,
          signature: hashEventAbi(functionOrEvent),
        };
      }
    });
  });
  return {functions: functions, events: events};
}

module.exports = generateAbiMap;
