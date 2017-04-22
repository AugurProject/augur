"use strict";

var periodCatchUp = require("./period-catch-up");
var feePenaltyCatchUp = require("./fee-penalty-catch-up");

// Increment vote period until vote period = current period - 1
function checkPeriod(branch, periodLength, sender, callback) {
  periodCatchUp(branch, periodLength, function (err, votePeriod) {
    if (err) return callback(err);
    feePenaltyCatchUp(branch, periodLength, votePeriod - 1, sender, function (err) {
      if (err) return callback(err);
      callback(null, votePeriod);
    });
  });
}

module.exports = checkPeriod;
