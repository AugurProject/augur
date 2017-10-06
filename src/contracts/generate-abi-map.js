"use strict";

var convertEventNameToSignature = require("../utils/convert-event-name-to-signature");

function generateAbiMap(abi) {
  var functions = {};
  var events = {};
  Object.keys(abi).forEach(function (contractName) {
    var functionsAndEventsArray = abi[contractName];
    functionsAndEventsArray.forEach(function (functionOrEvent) {
      var shortName = functionOrEvent.name.split("(")[0];
      if (functionOrEvent.type === "function") {
        var functionAbiMap = {
          constant: functionOrEvent.constant,
          name: functionOrEvent.name
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
        functions[contractName][shortName] = functionAbiMap;
      } else if (functionOrEvent.type === "event") {
        if (!events[contractName]) events[contractName] = {};
        var methodSignature = functionOrEvent.name + 
          "(" + functionOrEvent.inputs.map(input => input.type).join(",") + ")";
        events[contractName][shortName] = {
          contract: contractName,
          inputs: functionOrEvent.inputs,
          signature: convertEventNameToSignature(methodSignature)
        };
      }
    });
  });
  return {functions: functions, events: events};
}

module.exports = generateAbiMap;
