"use strict";

var uuid = require("uuid");
var uuidParse = require("uuid-parse");
var speedomatic = require("speedomatic");

function generateTradeGroupId() {
  return speedomatic.formatInt256(Buffer.from(uuidParse.parse(uuid.v4())).toString("hex"));
}

module.exports = generateTradeGroupId;
