"use strict";

var speedomatic = require("speedomatic");

var encodeTag = function (tag) {
  if (tag == null || tag === "") return "0x0";
  return speedomatic.abiEncodeShortStringAsInt256(tag.trim());
};

module.exports = encodeTag;
