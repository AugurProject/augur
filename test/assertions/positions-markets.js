import { assert } from 'chai';
import assertFormattedNumber from '../../test/assertions/common/formatted-number';


export default function (positionsMarkets) {
	assert.isDefined(positionsMarkets, `positionsMarkets isn't defined`);
	assert.isArray(positionsMarkets, `positionsMarkets isn't an array`);

	positionsMarkets.forEach(function(positionMarket) { assertPositionMarket(positionMarket) });
}

function assertPositionMarket(positionMarket) {
	assert.isString(positionMarket.id, `id isn't a string`);
	assert.isString(positionMarket.description, `description isn't a string`);

	positionMarket.outcomes.forEach(function(outcome) { assertOutcome(outcome) });
}

function assertOutcome(outcome) {
	assert.isNumber(outcome.id, `id isn't a number`);
	assert.isString(outcome.name, `name isn't a string`);
	assertFormattedNumber(outcome.lastPrice);
	assertPosition(outcome.position);
}

function assertPosition(position) {
	assertFormattedNumber(position.numPositions);
	assertFormattedNumber(position.qtyShares);
	assertFormattedNumber(position.purchasePrice);
	assertFormattedNumber(position.totalValue);
	assertFormattedNumber(position.totalCost);
	assertFormattedNumber(position.shareChange);
	assertFormattedNumber(position.gainPercent);
	assertFormattedNumber(position.netChange);
}