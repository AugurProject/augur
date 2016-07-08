import { assert } from 'chai';
import assertFormattedNumber from '../../test/assertions/common/formatted-number';

export default function (positionsSummary) {
	assert.isDefined(positionsSummary, `positionsSummary isn't defined`);
	assert.isObject(positionsSummary, `positionsSummary isn't an object`);
	assertFormattedNumber(positionsSummary.gainPercent);

	assertFormattedNumber(positionsSummary.netChange);
	assertFormattedNumber(positionsSummary.numPositions);
	assertFormattedNumber(positionsSummary.purchasePrice);
	assertFormattedNumber(positionsSummary.qtyShares);
	assertFormattedNumber(positionsSummary.shareChange);
	assertFormattedNumber(positionsSummary.totalCost);
	assertFormattedNumber(positionsSummary.totalValue);
};

