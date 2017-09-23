"use strict";

var keccak256 = require("../utils/keccak256");

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
          name: functionOrEvent.name,
          label: shortName.replace(/([A-Z])/g, " $1").replace(/^./, function (letter) {
            return letter.toUpperCase();
          })
        };
        var inputs = [];
        var signature = [];
        var fixed = [];
        if (functionOrEvent.inputs) {
          functionOrEvent.inputs.forEach(function (input, index) {
            inputs.push(input.name);
            signature.push(input.type);
            if (input.name.slice(0, 3) === "fxp") fixed.push(index);
          });
        }
        if (inputs.length) functionAbiMap.inputs = inputs;
        if (signature.length) functionAbiMap.signature = signature;
        if (fixed.length) functionAbiMap.fixed = fixed;
        if (functionOrEvent.outputs && functionOrEvent.outputs.length) {
          var output = functionOrEvent.outputs[0];
          functionAbiMap.returns = (output.name === "fxp") ? "unfix" : output.type;
        } else {
          functionAbiMap.returns = "null";
        }
        if (!functions[contractName]) functions[contractName] = {};
        functions[contractName][shortName] = functionAbiMap;
      } else if (functionOrEvent.type === "event") {
        if (!events[contractName]) events[contractName] = {};
        events[contractName][shortName] = {
          contract: contractName,
          inputs: functionOrEvent.inputs,
          signature: "0x" + keccak256(Buffer.from(functionOrEvent.name, "utf8")).toString("hex")
        };
      }
    });
  });
  return {functions: functions, events: events};
}

module.exports = generateAbiMap;
