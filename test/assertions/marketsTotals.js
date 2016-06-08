var assert = require('chai').assert;
// marketsTotals:
//  { positionsSummary:
//     { numPositions: [Object],
//       totalValue: [Object],
//       gainPercent: [Object] },
//    numPendingReports: 19 },
function marketsTotalsAssertion(actual) {
	assert.isDefined(actual, `marketsTotals isn't defined`);
	assert.isObject(actual, `marketsTotals isn't an object`);
	assert.isDefined(actual.positionsSummary, `marketsTotals.positionsSummary isn't defined`);
	assert.isObject(actual.positionsSummary, `marketsTotals.positionsSummary isn't an object as expected`);
	assert.isDefined(actual.numPendingReports, `marketsTotals.numPendingReports isn't defined`);
	assert.isNumber(actual.numPendingReports, `marketsTotals.numPendingReports isn't a number as expected.`)
}

function positionsSummaryAssertion(actual) {
	assert.isDefined(actual, `positionsSummary isn't defined`);
	assert.isObject(actual, `positionsSummary isn't an object`);

	var numPos = actual.numPositions;
	assert.isDefined(numPos, `positionsSummary.numPositions isn't defined`);
	assert.isObject(numPos, `positionsSummary.numPositions isn't a object`);
	assert.isDefined(numPos.value, `numPositions.value isn't defined`);
	assert.isNumber(numPos.value, `numPositions.value isn't a number`);
	assert.isDefined(numPos.formattedValue, `numPositions.formattedValue isn't defined`);
	assert.isNumber(numPos.formattedValue, `numPositions.formattedValue isn't a number`);
	assert.isDefined(numPos.formatted, `numPositions.formatted isn't defined`);
	assert.isString(numPos.formatted, `numPositions.formatted isn't a string`);
	assert.isDefined(numPos.roundedValue, `numPositions.roundedValue isn't defined`);
	assert.isNumber(numPos.roundedValue, `numPositions.roundedValue isn't a number`);
	assert.isDefined(numPos.rounded, `numPositions.rounded isn't defined`);
	assert.isString(numPos.rounded, `numPositions.rounded isn't a string`);
	assert.isDefined(numPos.minimized, `numPositions.minimized isn't defined`);
	assert.isString(numPos.minimized, `numPositions.minimized isn't a string`);
	assert.isDefined(numPos.denomination, `numPositions.denomination isn't defined`);
	assert.isString(numPos.denomination, `numPositions.denomination isn't a string`);
	assert.isDefined(numPos.full, `numPositions.full isn't defined`);
	assert.isString(numPos.full, `numPositions.full isn't a string`);

	var totVal = actual.totalValue;
	assert.isDefined(totVal, `positionsSummary.totalValue isn't defined`);
	assert.isObject(totVal, `positionsSummary.totalValue isn't a object`);
	assert.isDefined(totVal.value, `totalValue.value isn't defined`);
	assert.isNumber(totVal.value, `totalValue.value isn't a number`);
	assert.isDefined(totVal.formattedValue, `totalValue.formattedValue isn't defined`);
	assert.isNumber(totVal.formattedValue, `totalValue.formattedValue isn't a number`);
	assert.isDefined(totVal.formatted, `totalValue.formatted isn't defined`);
	assert.isString(totVal.formatted, `totalValue.formatted isn't a string`);
	assert.isDefined(totVal.roundedValue, `totalValue.roundedValue isn't defined`);
	assert.isNumber(totVal.roundedValue, `totalValue.roundedValue isn't a number`);
	assert.isDefined(totVal.rounded, `totalValue.rounded isn't defined`);
	assert.isString(totVal.rounded, `totalValue.rounded isn't a string`);
	assert.isDefined(totVal.minimized, `totalValue.minimized isn't defined`);
	assert.isString(totVal.minimized, `totalValue.minimized isn't a string`);
	assert.isDefined(totVal.denomination, `totalValue.denomination isn't defined`);
	assert.isString(totVal.denomination, `totalValue.denomination isn't a string`);
	assert.isDefined(totVal.full, `totalValue.full isn't defined`);
	assert.isString(totVal.full, `totalValue.full isn't a string`);

	var gain = actual.gainPercent;
	assert.isDefined(gain, `positionsSummary.gainPercent isn't defined`);
	assert.isObject(gain, `positionsSummary.gainPercent isn't a object`);
	assert.isDefined(gain.value, `gainPercent.value isn't defined`);
	assert.isNumber(gain.value, `gainPercent.value isn't a number`);
	assert.isDefined(gain.formattedValue, `gainPercent.formattedValue isn't defined`);
	assert.isNumber(gain.formattedValue, `gainPercent.formattedValue isn't a number`);
	assert.isDefined(gain.formatted, `gainPercent.formatted isn't defined`);
	assert.isString(gain.formatted, `gainPercent.formatted isn't a string`);
	assert.isDefined(gain.roundedValue, `gainPercent.roundedValue isn't defined`);
	assert.isNumber(gain.roundedValue, `gainPercent.roundedValue isn't a number`);
	assert.isDefined(gain.rounded, `gainPercent.rounded isn't defined`);
	assert.isString(gain.rounded, `gainPercent.rounded isn't a string`);
	assert.isDefined(gain.minimized, `gainPercent.minimized isn't defined`);
	assert.isString(gain.minimized, `gainPercent.minimized isn't a string`);
	assert.isDefined(gain.denomination, `gainPercent.denomination isn't defined`);
	assert.isString(gain.denomination, `gainPercent.denomination isn't a string`);
	assert.isDefined(gain.full, `gainPercent.full isn't defined`);
	assert.isString(gain.full, `gainPercent.full isn't a string`);
}

module.exports = {
	marketsTotalsAssertion: marketsTotalsAssertion,
	positionsSummaryAssertion: positionsSummaryAssertion
};
