"use strict";

var getScalarMinimum = require("../get-scalar-minimum");

function parametrizeOrder(market, outcomeID, numShares, limitPrice, tradeGroupID) {
  return {
    amount: numShares,
    price: limitPrice,
    market: market.id,
    outcome: outcomeID,
    tradeGroupID: tradeGroupID,
    scalarMinMax: getScalarMinimum(market.type, market.minValue)
  };
}

module.exports = parametrizeOrder;
