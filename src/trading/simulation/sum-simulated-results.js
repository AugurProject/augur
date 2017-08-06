"use strict";

function sumSimulatedResults(sumOfSimulatedResults, simulatedResults) {
  return Object.keys(sumOfSimulatedResults).reduce(function (updatedSumOfSimulatedResults, tradeField) {
    if (tradeField === "shareBalances") {
      updatedSumOfSimulatedResults[tradeField] = simulatedResults[tradeField];
    } else if (simulatedResults[tradeField] != null) {
      updatedSumOfSimulatedResults[tradeField] = sumOfSimulatedResults[tradeField].plus(simulatedResults[tradeField]);
    }
    return updatedSumOfSimulatedResults;
  }, {});
}

module.exports = sumSimulatedResults;
