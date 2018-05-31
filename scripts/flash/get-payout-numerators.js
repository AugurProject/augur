var BigNumber = require("bignumber.js");

function createBigNumber(n) {
  var result;
  try {
    result = new BigNumber(n, 10);
  } catch (e) {
    console.log("Error converting BigNumber", e);
  }
  return result;
}

function getPayoutNumerators(market, selectedOutcome, invalid) {
  var maxPrice = createBigNumber(market.maxPrice);
  var minPrice = createBigNumber(market.minPrice);
  var numTicks = createBigNumber(market.numTicks);
  var numOutcomes = market.numOutcomes;

  var payoutNumerators = Array(numOutcomes).fill(new BigNumber(0));
  var isScalar = market.marketType === "scalar";

  if (invalid) {
    var equalValue = createBigNumber(numTicks).dividedBy(market.numOutcomes).dp(0, BigNumber.ROUND_DOWN);
    return Array(market.numOutcomes).fill(equalValue);

  } else if (isScalar) {
		// selectedOutcome must be a BN as string
    var priceRange = maxPrice.minus(minPrice);
    selectedOutcome = selectedOutcome.replace(/\"/g, "");
    var reportNormalizedToZero = createBigNumber(selectedOutcome).minus(minPrice);
    var longPayout = reportNormalizedToZero.times(numTicks).dividedBy(priceRange);
    var shortPayout = numTicks.minus(longPayout);
    payoutNumerators[0] = shortPayout;
    payoutNumerators[1] = longPayout;
  } else {
		// for binary and categorical the selected outcome is outcome.id
		// and must be a number
    payoutNumerators[selectedOutcome] = numTicks;
  }

  console.log("payout numerators", JSON.stringify(payoutNumerators));
  return payoutNumerators;
}

module.exports = getPayoutNumerators;
