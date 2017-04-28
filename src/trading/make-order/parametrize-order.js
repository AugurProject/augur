"use strict";

var assign = require("lodash.assign");
var getScalarMinimum = require("./get-scalar-minimum");

function parametrizeOrder(p, market, outcomeID, numShares, limitPrice, tradeGroupID) {
  return assign({}, p, {
    amount: numShares,
    price: limitPrice,
    market: market.id,
    outcome: outcomeID,
    tradeGroupID: tradeGroupID,
    scalarMinMax: getScalarMinimum(market.type, market.minValue)
  });
}

module.exports = parametrizeOrder;
