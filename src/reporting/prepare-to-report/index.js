"use strict";

var periodCatchUp = require("./period-catch-up");
var feePenaltyCatchUp = require("./fee-penalty-catch-up");

// Increment vote period until vote period = current period - 1
function prepareToReport(p, branch, periodLength, sender, callback) {
  periodCatchUp(p, branch, periodLength, function (err, votePeriod) {
    if (err) return callback(err);
    feePenaltyCatchUp(p, branch, periodLength, votePeriod - 1, sender, function (err) {
      if (err) return callback(err);
      callback(null, votePeriod);
    });
  });
}

module.exports = prepareToReport;
