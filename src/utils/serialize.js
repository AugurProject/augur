"use strict";

var abi = require("augur-abi");
var BigNumber = require("bignumber.js");
var constants = require("../constants");

var serialize = function (x) {
  var serialized, bn, i, n;
  if (x !== null && x !== undefined) {

    // if x is an array, serialize and concatenate its individual elements
    if (x.constructor === Array || Buffer.isBuffer(x)) {
      serialized = "";
      for (i = 0, n = x.length; i < n; ++i) {
        serialized += serialize(x[i]);
      }
    } else {

      // input is a base-10 javascript number
      if (x.constructor === Number) {
        bn = new BigNumber(x, 10);
        if (bn.lt(constants.ZERO)) {
          bn = bn.add(abi.constants.MOD);
        }
        serialized = abi.encode_int(bn);

      // input is a utf8 or hex string
      } else if (x.constructor === String) {

        // negative hex
        if (x.slice(0, 1) === "-") {
          serialized = abi.encode_int(new BigNumber(x, 16).add(abi.constants.MOD).toFixed());

        // positive hex
        } else if (x.slice(0, 2) === "0x") {
          serialized = abi.pad_left(x.slice(2));

        // text string
        } else {
          serialized = Buffer.from(x, "utf8").toString("hex");
        }
      }
    }
  }
  return serialized;
};

module.exports = serialize;
