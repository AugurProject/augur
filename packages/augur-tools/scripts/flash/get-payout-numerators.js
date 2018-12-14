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

function getPayoutNumerators(market, selectedOutcome, asPrice) {
  if (selectedOutcome.toString().indexOf(",") !== -1) {
    var values = selectedOutcome.split(",").map(function (x) { return new BigNumber(x); });
    if (values.length !== market.numOutcomes) throw new Error("numTicks array needs " + market.numOutcomes + " values, you provided " + values.length);
    return values;
  }
  if (!asPrice && (selectedOutcome >= numOutcomes || selectedOutcome < 0)) throw new Error("selected outcome not as value is not valid index");
  var maxPrice = createBigNumber(market.maxPrice);
  var minPrice = createBigNumber(market.minPrice);
  var numTicks = createBigNumber(market.numTicks);
  var numOutcomes = market.numOutcomes;

  var payoutNumerators = Array(numOutcomes).fill(new BigNumber(0));
  var isScalar = market.marketType === "scalar";

  if (isScalar && asPrice) {
		// selectedOutcome must be a BN as string
    var priceRange = maxPrice.minus(minPrice);
    selectedOutcome = selectedOutcome.replace(/\"/g, "");
    var reportNormalizedToZero = createBigNumber(selectedOutcome).minus(minPrice);
    var longPayout = reportNormalizedToZero.times(numTicks).dividedBy(priceRange);
    var shortPayout = numTicks.minus(longPayout);
    payoutNumerators[1] = shortPayout;
    payoutNumerators[2] = longPayout;
  } else {
		// for yesNo and categorical the selected outcome is outcome.id
		// and must be a number
    payoutNumerators[selectedOutcome] = numTicks;
  }

  console.log("payout numerators", JSON.stringify(payoutNumerators));
  return payoutNumerators;
}

module.exports = getPayoutNumerators;
