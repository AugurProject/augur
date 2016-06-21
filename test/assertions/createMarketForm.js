import { assert } from 'chai';

export function step1(actual){
	describe('createMarketForm step 1 component assertions', () => {
		it('should receive step and be a number', () => {
			assert.isDefined(actual.step, 'step is not defined');
			assert.isNumber(actual.step, 'step is not a number');
		});

		it('should receive creatingMarket and be a boolean', () => {
			assert.isDefined(actual.creatingMarket, 'creatingMarket is not defined');
			assert.isBoolean(actual.creatingMarket, 'creatingMarket is not a boolean');
		});

		it('should receive errors and be an object', () => {
			assert.isDefined(actual.errors, 'errors is not defined');
			assert.isObject(actual.errors, 'errors is not an object');
		});

		it('should receive onValuesUpdated and be a function', () => {
			assert.isDefined(actual.onValuesUpdated, 'onValuesUpdated is not defined');
			assert.isFunction(actual.onValuesUpdated, 'onValuesUpdated is not a function');
		});
	});
}