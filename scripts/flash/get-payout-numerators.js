

function getPayoutNumerators(market, selectedOutcome, invalid) {
  var maxPrice = market.maxPrice;
  var minPrice = market.minPrice;
  var numTicks = market.numTicks;
  var numOutcomes = market.numOutcomes;

  var payoutNumerators = Array(numOutcomes).fill(0);
  var isScalar = market.marketType === "scalar";

  if (invalid) {
    var equalValue = numTicks / numOutcomes;
    return Array(numOutcomes).fill(equalValue);

  } else if (isScalar) {
    var priceRange = maxPrice - minPrice;
    var reportNormalizedToZero = selectedOutcome - minPrice;
    var longPayout = (reportNormalizedToZero * numTicks) / priceRange;
    var shortPayout = numTicks - longPayout;
    payoutNumerators[0] = shortPayout;
    payoutNumerators[1] = longPayout;
  } else {
    // for binary and categorical the selected outcome is outcome.id
    payoutNumerators[selectedOutcome] = numTicks;
  }

  console.log("payout numerators", payoutNumerators);
  return payoutNumerators;
}

module.exports = getPayoutNumerators;
