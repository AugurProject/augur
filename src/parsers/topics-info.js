"use strict";

var abi = require("augur-abi");
var decodeTag = require("../format/tag/decode-tag");

module.exports = function (topicsInfo) {
  var i, len, parsedTopicsInfo = {};
  for (i = 0, len = topicsInfo.length; i < len; i += 2) {
    parsedTopicsInfo[decodeTag(topicsInfo[i])] = abi.unfix(topicsInfo[i + 1], "number");
  }
  return parsedTopicsInfo;
};
