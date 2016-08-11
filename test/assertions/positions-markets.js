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

	positionMarket.positionOutcomes.forEach(function(positionOutcome) { assertOutcome(positionOutcome) });
}

function assertOutcome(outcome) {
	assert.isNumber(outcome.id, `id isn't a number`);
	assert.isString(outcome.name, `name isn't a string`);
	assertFormattedNumber(outcome.lastPrice, 'positionsMarkets.positionOutcomes[outcome].lastPrice');
	assertPosition(outcome.position);
}

function assertPosition(position) {
	assertFormattedNumber(position.numPositions, 'positionsMarkets.positionOutcomes[outcome].position.numPositions');
	assertFormattedNumber(position.qtyShares, 'positionsMarkets.positionOutcomes[outcome].position.qtyShares');
	assertFormattedNumber(position.purchasePrice, 'positionsMarkets.positionOutcomes[outcome].position.purchasePrice');
	assertFormattedNumber(position.totalValue, 'positionsMarkets.positionOutcomes[outcome].position.totalValue');
	assertFormattedNumber(position.totalCost, 'positionsMarkets.positionOutcomes[outcome].position.totalCost');
	assertFormattedNumber(position.shareChange, 'positionsMarkets.positionOutcomes[outcome].position.shareChange');
	assertFormattedNumber(position.gainPercent, 'positionsMarkets.positionOutcomes[outcome].position.gainPercent');
	assertFormattedNumber(position.netChange, 'positionsMarkets.positionOutcomes[outcome].position.netChange');
}