import { assert } from 'chai';
import assertFormattedNumber from '../../test/assertions/common/formatted-number';

export default function (positionsSummary) {
	assert.isDefined(positionsSummary, `positionsSummary isn't defined`);
	assert.isObject(positionsSummary, `positionsSummary isn't an object`);
	assertFormattedNumber(positionsSummary.gainPercent);

	assertFormattedNumber(positionsSummary.netChange, 'netChange');
	assertFormattedNumber(positionsSummary.numPositions, 'numPositions');
	assertFormattedNumber(positionsSummary.purchasePrice, 'purchasePrice');
	assertFormattedNumber(positionsSummary.qtyShares, 'qtyShares');
	assertFormattedNumber(positionsSummary.shareChange, 'shareChange');
	assertFormattedNumber(positionsSummary.totalCost, 'totalCost');
	assertFormattedNumber(positionsSummary.totalValue, 'totalValue');
};

