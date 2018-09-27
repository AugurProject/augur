"use strict";

function defaultGetGasPrice(callback) {
  callback(this.rpc.getGasPrice());
}

function setGasPriceFunction(newGasPriceFunction) {
  if (newGasPriceFunction === undefined) {
    this.getGasPrice = defaultGetGasPrice;
  } else {
    this.getGasPrice = newGasPriceFunction;
  }
}

module.exports = setGasPriceFunction;
