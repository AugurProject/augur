"use strict";

var hashEventSignature = require("./hash-event-signature");

function hashEventAbi(eventAbi) {
  return hashEventSignature(eventAbi.name + "(" + eventAbi.inputs.map(function (input) { return input.type; }).join(",") + ")");
}

module.exports = hashEventAbi;
