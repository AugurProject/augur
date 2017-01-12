/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var abi = require("augur-abi");

module.exports = {

  parseMarket: function (market) {
    return abi.format_int256(market);
  },

  parseMarkets: function (markets) {
    if (!markets) return markets;
    var numMarkets = markets.length;
    var parsedMarkets = new Array(numMarkets);
    for (var i = 0; i < numMarkets; ++i) {
      parsedMarkets[i] = this.parseMarket(markets[i]);
    }
    return parsedMarkets;
  },

  parseEventInfo: function (info) {
    // 0: self.Events[event].branch
    // 1: self.Events[event].expirationDate
    // 2: self.Events[event].outcome
    // 3: self.Events[event].minValue
    // 4: self.Events[event].maxValue
    // 5: self.Events[event].numOutcomes
    // 6: self.Events[event].bond
    if (info && info.length) {
      info[0] = abi.hex(info[0]);
      info[1] = abi.bignum(info[1]).toFixed();
      info[2] = abi.unfix(info[2], "string");
      info[3] = abi.unfix(abi.hex(info[3], true), "string");
      info[4] = abi.unfix(abi.hex(info[4], true), "string");
      info[5] = parseInt(info[5]);
      info[6] = abi.unfix(info[6], "string");
    }
    return info;
  }
};
