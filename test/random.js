"use strict";

var abi = require("augur-abi");
var utils = require("../src/utilities");

var random = {
  hash: function () {
    return abi.prefix_hex(utils.sha256(Math.random().toString()));
  },
  int256: function () {
    return this.hash();
  },
  address: function () {
    return abi.format_address(Math.floor(Math.random() * 1e24).toString(16));
  },
  int: function (min, max) {
    min = min || 0;
    max = max || 100;
    return Math.floor(Math.random() * (max - min)) + min;
  },
  intString: function (min, max) {
    return this.int(min, max).toString();
  },
  intHexString: function (min, max) {
    return abi.prefix_hex(this.int(min, max).toString(16));
  },
  float: function (max) {
    max = max || 10;
    return (Math.random() * max).toFixed(6);
  },
  string: function (size) {
    size = size || 128;
    return new Array(size + 1).join((Math.random().toString(36) + "00000000000000000").slice(2, 18)).slice(0, size);
  },
  array: function (size) {
    size = size || 2;
    var arr = new Array(size);
    for (var i = 0; i < size; ++i) {
      arr[i] = this.int();
    }
    return arr;
  },
  hashArray: function (size) {
    size = size || 2;
    var arr = new Array(size);
    for (var i = 0; i < size; ++i) {
      arr[i] = this.hash();
    }
    return arr;
  },
  fixed: function (max) {
    return abi.fix(this.float(max), "hex");
  },
  fixedInt: function (min, max) {
    return abi.fix(this.int(min, max), "hex");
  },
  bool: function () {
    return Math.round(Math.random()).toString();
  },
  ether: function (min, max) {
    return this.int(min, max);
  }
};
random["int256[]"] = function (size) { return this.hashArray(size); };
random["bytes"] = function (size) { return this.string(size); };

module.exports = random;
