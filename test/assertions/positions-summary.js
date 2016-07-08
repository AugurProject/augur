import assertFormattedNumber from '../../test/assertions/common/formatted-number';

var assert = require('chai').assert;

module.exports = function (actual) {
	assert.isDefined(actual, `positionsSummary isn't defined`);
	assert.isObject(actual, `positionsSummary isn't an object`);
	assertFormattedNumber(actual.gainPercent);

	assertFormattedNumber(actual.netChange);
	assertFormattedNumber(actual.numPositions);
	assertFormattedNumber(actual.purchasePrice);
	assertFormattedNumber(actual.qtyShares);
	assertFormattedNumber(actual.shareChange);
	assertFormattedNumber(actual.totalCost);
	assertFormattedNumber(actual.totalValue);
};

