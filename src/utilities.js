"use strict";

var NODE_JS = (typeof module !== "undefined") && process && !process.browser;

var crypto = require("crypto");
var BigNumber = require("bignumber.js");
var clone = require("clone");
var abi = require("augur-abi");
var constants = require("./constants");

BigNumber.config({
  MODULO_MODE: BigNumber.EUCLID,
  ROUNDING_MODE: BigNumber.ROUND_HALF_DOWN
});

module.exports = {

  noop: function () {},

  pass: function (o) { return o; },

  is_function: function (f) {
    return Object.prototype.toString.call(f) === "[object Function]";
  },

  STRIP_COMMENTS: /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,

  ARGUMENT_NAMES: /([^\s,]+)/g,

  compose: function (prepare, callback) {
    if (!this.is_function(callback)) return null;
    if (!this.is_function(prepare)) return callback;
    return function (result) { return prepare(result, callback); };
  },

  labels: function (func) {
    var fnStr = func.toString().replace(this.STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(this.ARGUMENT_NAMES);
    if (result === null) result = [];
    return result;
  },

  unpack: function (o, labels, args) {
    var params = [], cb = [];

    // unpack object argument
    if (o !== undefined && o !== null && o.constructor === Object &&
      labels && labels.constructor === Array && labels.length) {
      for (var i = 0, len = labels.length; i < len; ++i) {
        if (o[labels[i]] !== undefined) {
          if (o[labels[i]].constructor === Function) {
            cb.push(o[labels[i]]);
          } else {
            params.push(o[labels[i]]);
          }
        }
      }
    // unpack positional arguments
    } else {
      for (var j = 0, arglen = args.length; j < arglen; ++j) {
        if (args[j] !== undefined) {
          if (args[j] && args[j].constructor === Function) {
            cb.push(args[j]);
          } else {
            params.push(args[j]);
          }
        }
      }
    }

    return { params: params, cb: cb };
  },

  unique: function (value, index, self) {
    return self.indexOf(value) === index;
  },

  serialize: function (x) {
    var serialized, bn;
    if (x !== null && x !== undefined) {

      // if x is an array, serialize and concatenate its individual elements
      if (x.constructor === Array || Buffer.isBuffer(x)) {
        serialized = "";
        for (var i = 0, n = x.length; i < n; ++i) {
          serialized += this.serialize(x[i]);
        }
      } else {

        // input is a base-10 javascript number
        if (x.constructor === Number) {
          bn = abi.bignum(x);
          if (bn.lt(constants.ZERO)) {
            bn = bn.add(abi.constants.MOD);
          }
          serialized = abi.encode_int(bn);

        // input is a utf8 or hex string
        } else if (x.constructor === String) {

          // negative hex
          if (x.slice(0,1) === '-') {
            serialized = abi.encode_int(abi.bignum(x).add(abi.constants.MOD).toFixed());

          // positive hex
          } else if (x.slice(0,2) === "0x") {
            serialized = abi.pad_left(x.slice(2));

          // text string
          } else {
            serialized = new Buffer(x, "utf8").toString("hex");
          }
        }
      }
    }
    return serialized;
  },

  sha256: function (hashable) {
    return abi.hex(abi.prefix_hex(crypto.createHash("sha256").update(this.serialize(hashable)).digest("hex")), true);
  },

  sha3: function (hashable) {
    return abi.prefix_hex(abi.sha3(this.serialize(hashable)));
  }

};
