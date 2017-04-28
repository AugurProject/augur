"use strict";

var longerPositionPL = require("./longer-position-pl");
var shorterPositionPL = require("./shorter-position-pl");

// Trades where user is the taker:
//  - buy orders: user loses cash, gets shares
//  - sell orders: user loses shares, gets cash
function calculateTakerPL(PL, type, price, shares) {

  // Buy order
  if (type === "buy") {
    // console.log('buy (taker):', PL.position.toFixed(), PL.meanOpenPrice.toFixed(), price.toFixed(), shares.toFixed(), JSON.stringify(PL.tradeQueue));
    return longerPositionPL(PL, shares, price);
  }

  // Sell order
  // console.log('sell (taker):', PL.position.toFixed(), PL.meanOpenPrice.toFixed(), price.toFixed(), shares.toFixed(), JSON.stringify(PL.tradeQueue));
  return shorterPositionPL(PL, shares, price);
}

module.exports = calculateTakerPL;
