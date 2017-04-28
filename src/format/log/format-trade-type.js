"use strict";

var formatTradeType = function (type) {
  return (parseInt(type, 16) === 1) ? "buy" : "sell";
};

module.exports = formatTradeType;
