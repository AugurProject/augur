"use strict";

var longerPositionPL = require("./longer-position-pl");
var shorterPositionPL = require("./shorter-position-pl");

// Trades where user is the maker:
//  - buy orders (matched user's ask): user loses shares, gets cash
//  - sell orders (matched user's bid): user loses cash, gets shares
function calculateMakerPL(PL, type, price, shares) {

  // Sell: matched user's bid order
  if (type === "sell") {
    // console.log('sell (maker):', PL.position.toFixed(), PL.meanOpenPrice.toFixed(), price.toFixed(), shares.toFixed(), JSON.stringify(PL.tradeQueue));
    return longerPositionPL(PL, shares, price);
  }

  // Buy: matched user's ask order
  // console.log('buy (maker):', PL.position.toFixed(), PL.meanOpenPrice.toFixed(), price.toFixed(), shares.toFixed(), JSON.stringify(PL.tradeQueue));
  return shorterPositionPL(PL, shares, price);
}

module.exports = calculateMakerPL;
