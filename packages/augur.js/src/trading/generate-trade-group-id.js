"use strict";

var secureRandom = require("secure-random");
var TRADE_GROUP_ID_NUM_BYTES = require("../constants").TRADE_GROUP_ID_NUM_BYTES;

function generateTradeGroupId(tradeGroupIdNumBytes) {
  return "0x" + Buffer.from(secureRandom(tradeGroupIdNumBytes || TRADE_GROUP_ID_NUM_BYTES)).toString("hex");
}

module.exports = generateTradeGroupId;
