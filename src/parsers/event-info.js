"use strict";

var abi = require("augur-abi");

// 0: self.Events[event].branch
// 1: self.Events[event].expirationDate
// 2: self.Events[event].outcome
// 3: self.Events[event].minValue
// 4: self.Events[event].maxValue
// 5: self.Events[event].numOutcomes
// 6: self.Events[event].bond
module.exports = function (info) {
  if (info && info.length) {
    info[0] = abi.hex(info[0]);
    info[1] = abi.bignum(info[1]).toFixed();
    info[2] = abi.unfix(info[2], "string");
    info[3] = abi.unfix(abi.hex(info[3], true), "string");
    info[4] = abi.unfix(abi.hex(info[4], true), "string");
    info[5] = parseInt(info[5], 16);
    info[6] = abi.unfix(info[6], "string");
  }
  return info;
};
