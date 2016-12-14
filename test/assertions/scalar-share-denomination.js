import { describe } from 'mocha';
import { assert } from 'chai';

export default function (scalarShareDenomination) {
	assert.isDefined(scalarShareDenomination, `scalarShareDenomination isn't defined`);
	assert.isObject(scalarShareDenomination, `scalarShareDenomination isn't an object`);


	describe('scalarShareDenomination.markets', () => {
		const markets = scalarShareDenomination.markets;

		assert.isDefined(markets, `markets isn't defined`);
		assert.isObject(markets, `markets isn't an object`);

		Object.keys(markets || {}).forEach((market) => {
			assert.isDefined(markets[market], `markets.market isn't defined`);
			assert.isString(markets[market], `markets.market isn't a string`);
		});

	});

	describe('scalarShareDenomination.denominations', () => {
		const denominations = scalarShareDenomination.denominations;

		assert.isDefined(denominations, `denominations isn't defined`);
		assert.isArray(denominations, `denominations isn't an array`);

		(denominations || []).forEach((denomination) => {
			assert.isDefined(denomination, `denominations.denomination isn't defined`);
			assert.isObject(denomination, `denominations.denomination isn't an object`);

			assert.isDefined(denomination.label, `denomination.label isn't defined`);
			assert.isString(denomination.label, `denomination.label isn't a string`);

			assert.isDefined(denomination.value, `denomination.value isn't defined`);
			assert.isString(denomination.value, `denomination.value isn't a string`);
		});
	});

	assert.isDefined(scalarShareDenomination.updateSelectedShareDenomination, `updateSelectedShareDenomination isn't defined`);
	assert.isFunction(scalarShareDenomination.updateSelectedShareDenomination, `updateSelectedShareDenomination isn't a function`);
}
