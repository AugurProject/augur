import { assert } from 'chai';
import assertFormattedNumber from './common/formatted-number';
import assertMarketLink from './common/market-link';

export default function (positionsMarkets) {
	assert.isDefined(positionsMarkets, `positionsMarkets isn't defined`);
	assert.isArray(positionsMarkets, `positionsMarkets isn't an array`);

	positionsMarkets.forEach(function(positionMarket) { assertPositionMarket(positionMarket) });
}

function assertPositionMarket(positionMarket) {
	describe('positionMarket', () => {
		it('id', () => {
			assert.isDefined(positionMarket.id, `'positionMarket.id' is not defined`);
			assert.isString(positionMarket.id, `'positionMarket.id' isn't a string`);
		});

		it('marketLink', () => {
			assert.isDefined(positionMarket.marketLink, `'positionMarket.marketLink' is not defined`);
			assertMarketLink(positionMarket.marketLink, 'positionMarket.marketLink');
		});


		it('description', () => {
			assert.isDefined(positionMarket.description, `'positionMarket.description' is not defined`);
			assert.isString(positionMarket.description, `'positionMarket.description' isn't a string`);
		});

		positionMarket.myPositionOutcomes.forEach(function(positionOutcome) { assertOutcome(positionOutcome) });
	});
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