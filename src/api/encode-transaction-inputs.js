"use strict";

var speedomatic = require("speedomatic");
var transactionInputEncoders = require("./transaction-input-encoders");

function encodeTransactionInputs(p, inputs, signature, fixedPointIndex) {
  var numInputs = (Array.isArray(inputs) && inputs.length) ? inputs.length : 0;
  if (!numInputs) return [];
  var encodedTransactionInputs = new Array(numInputs);
  for (var i = 0; i < numInputs; ++i) {
    encodedTransactionInputs[i] = transactionInputEncoders[signature[i]] ? transactionInputEncoders[signature[i]](p[inputs[i]]) : p[inputs[i]];
  }
  if (Array.isArray(fixedPointIndex) && fixedPointIndex.length) {
    var numFixed = fixedPointIndex.length;
    for (i = 0; i < numFixed; ++i) {
      encodedTransactionInputs[fixedPointIndex[i]] = speedomatic.formatInt256(speedomatic.fix(encodedTransactionInputs[fixedPointIndex[i]], "hex"));
    }
  }
  return encodedTransactionInputs;
}

module.exports = encodeTransactionInputs;
