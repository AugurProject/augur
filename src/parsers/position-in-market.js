"use strict";

var speedomatic = require("speedomatic");

module.exports = function (positionInMarket) {
  var numOutcomes, position, i;
  if (!positionInMarket || positionInMarket.error) return positionInMarket;
  numOutcomes = positionInMarket.length;
  position = {};
  for (i = 0; i < numOutcomes; ++i) {
    position[i + 1] = speedomatic.unfix(speedomatic.hex(positionInMarket[i], true), "string");
  }
  return position;
};
