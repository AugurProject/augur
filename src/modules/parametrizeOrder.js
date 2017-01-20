"use strict";

module.exports = {

  parametrizeOrder: function (market, outcomeID, numShares, limitPrice, tradeGroupID) {
    return {
      amount: numShares,
      price: limitPrice,
      market: market.id,
      outcome: outcomeID,
      tradeGroupID: tradeGroupID,
      scalarMinMax: this.getScalarMinimum(market.type, market.minValue)
    };
  },

  getScalarMinimum: function (type, minValue) {
    var scalarMinimum = {};
    if (type === "scalar") scalarMinimum.minValue = minValue;
    return scalarMinimum;
  }

};
