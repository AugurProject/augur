"use strict";

var abi = require("augur-abi");

var encodeTag = function (tag) {
  if (tag === null || tag === undefined || tag === "") return "0x0";
  return abi.short_string_to_int256(tag.trim());
};

module.exports = encodeTag;
