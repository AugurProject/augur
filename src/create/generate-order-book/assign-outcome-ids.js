"use strict";

function assignOutcomeIDs(numOutcomes) {
  var i, outcomes = new Array(numOutcomes);
  for (i = 0; i < numOutcomes; ++i) {
    outcomes[i] = i + 1;
  }
  return outcomes;
}

module.exports = assignOutcomeIDs;
