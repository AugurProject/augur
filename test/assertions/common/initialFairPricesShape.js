import { assert } from 'chai';

export default function (initialFairPrices){
	assert.isDefined(initialFairPrices.type, 'initialFairPrices.type is not defined');
	assert.isString(initialFairPrices.type, 'initialFairPrices.type is not a string');

	assert.isDefined(initialFairPrices.values, 'initialFairPrices.values is not defined');
	assert.isArray(initialFairPrices.values, 'initialFairPrices.values is not an array');

	assert.isDefined(initialFairPrices.raw, 'initialFairPrices.raw is not defined');
	assert.isArray(initialFairPrices.raw, 'initialFairPrices.raw is not an array');
}