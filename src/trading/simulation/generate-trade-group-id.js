"use strict";

var uuid = require("uuid");
var uuidParse = require("uuid-parse");
var abi = require("augur-abi");

function generateTradeGroupID() {
  return abi.format_int256(Buffer.from(uuidParse.parse(uuid.v4())).toString("hex"));
}

module.exports = generateTradeGroupID;
