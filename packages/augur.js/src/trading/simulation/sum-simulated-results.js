"use strict";

function sumSimulatedResults(sumOfSimulatedResults, simulatedResults) {
  return Object.keys(sumOfSimulatedResults).reduce(function (updatedSumOfSimulatedResults, tradeField) {
    if (tradeField === "shareBalances") {
      updatedSumOfSimulatedResults[tradeField] = simulatedResults[tradeField];
    } else if (simulatedResults[tradeField] !== undefined) {
      updatedSumOfSimulatedResults[tradeField] = sumOfSimulatedResults[tradeField].plus(simulatedResults[tradeField]);
    } else {
      updatedSumOfSimulatedResults[tradeField] = sumOfSimulatedResults[tradeField];
    }
    return updatedSumOfSimulatedResults;
  }, {});
}

module.exports = sumSimulatedResults;
