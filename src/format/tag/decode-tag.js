"use strict";

var speedomatic = require("speedomatic");

var decodeTag = function (tag) {
  try {
    return (tag && tag !== "0x0" && tag !== "0x") ?
      speedomatic.abiDecodeShortStringAsInt256(speedomatic.unfork(tag, true)) : null;
  } catch (exc) {
    console.error("decodeTag failed:", exc, tag);
    return null;
  }
};

module.exports = decodeTag;
