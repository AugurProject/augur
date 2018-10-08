"use strict";

var ethrpc = require("ethrpc");

function defaultGetGasPrice(callback) {
  callback(ethrpc.getGasPrice());
}

var gasPriceFunction = defaultGetGasPrice;

function getGasPrice(newGasPriceFunction) {
  if (newGasPriceFunction === undefined) {
    gasPriceFunction = defaultGetGasPrice;
  } else {
    gasPriceFunction = newGasPriceFunction;
  }
}

module.exports = {
  get: function () {
    return gasPriceFunction;
  },
  set: getGasPrice,
};
