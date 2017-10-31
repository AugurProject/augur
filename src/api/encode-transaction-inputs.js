"use strict";

var transactionInputEncoders = require("./transaction-input-encoders");

function encodeTransactionInputs(p, inputs, signature) {
  var numInputs = (Array.isArray(inputs) && inputs.length) ? inputs.length : 0;
  if (!numInputs) return [];
  var encodedTransactionInputs = new Array(numInputs);
  for (var i = 0; i < numInputs; ++i) {
    encodedTransactionInputs[i] = transactionInputEncoders[signature[i]] ? transactionInputEncoders[signature[i]](p[inputs[i]]) : p[inputs[i]];
  }
  return encodedTransactionInputs;
}

module.exports = encodeTransactionInputs;
