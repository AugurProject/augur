"use strict";

var contractAbis = require("./abi");
var keccak256 = require("../utils/keccak256");

function generateAbiMap() {
  var functions = {};
  var events = {};
  Object.keys(contractAbis).forEach(function (contractName) {
    var functionsAndEventsArray = contractAbis[contractName];
    functionsAndEventsArray.forEach(function (functionOrEvent) {
      var shortName = functionOrEvent.name.split("(")[0];
      if (functionOrEvent.type === "function") {
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
        var output = functionOrEvent.outputs[0];
        if (!functions[contractName]) functions[contractName] = {};
        functions[contractName][shortName] = {
          constant: functionOrEvent.constant,
          name: functionOrEvent.name,
          inputs: inputs,
          signature: signature,
          fixed: fixed,
          returns: (output) ? ((output.name === "fxp") ? "unfix" : output.type) : "null"
        };
      } else if (functionOrEvent.type === "event") {
        events[shortName] = {
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
