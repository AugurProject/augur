"use strict";

function sumSimulatedResults(simulatedResults, sumOfSimulatedResults) {
  return Object.keys(sumOfSimulatedResults).reduce(function (updatedSumOfSimulatedResults, tradeField) {
    if (simulatedResults[tradeField] != null) {
      updatedSumOfSimulatedResults[tradeField] = sumOfSimulatedResults.plus(simulatedResults[tradeField]);
    }
    return updatedSumOfSimulatedResults;
  }, {});
}

module.exports = sumSimulatedResults;
