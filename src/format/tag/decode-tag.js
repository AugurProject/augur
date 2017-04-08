"use strict";

var abi = require("augur-abi");

var decodeTag = function (tag) {
  try {
    return (tag && tag !== "0x0" && tag !== "0x") ?
      abi.int256_to_short_string(abi.unfork(tag, true)) : null;
  } catch (exc) {
    console.error("decodeTag failed:", exc, tag);
    return null;
  }
};

module.exports = decodeTag;
