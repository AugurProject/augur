"use strict";

var formatTradeType = function (orderType) {
  return (parseInt(orderType, 16) === 0) ? "buy" : "sell";
};

module.exports = formatTradeType;
