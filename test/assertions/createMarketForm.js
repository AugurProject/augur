import { assert } from 'chai';

export function step1(actual){
	describe('augur-ui-react-components createMarketForm step-1', () => {
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

export function step2(actual){
	describe(`augur-ui-react-components createMarketForm step-2 ${actual.type} market state`, () => {
		it('should receive type and be a string', () => {
			assert.isDefined(actual.type, 'type is not defined');
			assert.isString(actual.type, 'type is not a string');
		});

		it('should receive initialFairPrices and be an object', () => {
			assert.isDefined(actual.initialFairPrices, 'initialFairPrices is not defined');
			assert.isObject(actual.initialFairPrices, 'initialFairPrices is not an object');
		});

		it('should receive the proper shape within initialFairPrices', () => {
			assert.isDefined(actual.initialFairPrices.type, 'initialFairPrices.type is not defined');
			assert.isString(actual.initialFairPrices.type, 'initialFairPrices.type is not a string');

			assert.isDefined(actual.initialFairPrices.values, 'initialFairPrices.values is not defined');
			assert.isArray(actual.initialFairPrices.values, 'initialFairPrices.values is not an array');

			assert.isDefined(actual.initialFairPrices.raw, 'initialFairPrices.raw is not defined');
			assert.isArray(actual.initialFairPrices.raw, 'initialFairPrices.raw is not an array');
		});

		it('should receive descriptionPlaceholder and be a string', () => {
			assert.isDefined(actual.descriptionPlaceholder, 'descriptionPlaceholder is not defined');
			assert.isString(actual.descriptionPlaceholder, 'descriptionPlaceholder is not a string');
		});
		
		it('should receive descriptionMaxLength and be a number', () => {
			assert.isDefined(actual.descriptionMaxLength, 'descriptionMaxLength is not defined');
			assert.isNumber(actual.descriptionMaxLength, 'descriptionMaxLength is not a number');
		});

		switch(actual.type){
		case 'categorical':
			it('should receive categoricalOutcomesMinNum and be a number', () => {
				assert.isDefined(actual.categoricalOutcomesMinNum, 'categoricalOutcomesMinNum is not defined');
				assert.isNumber(actual.categoricalOutcomesMinNum, 'categoricalOutcomesMinNum is not a number');
			});

			it('should receive categoricalOutcomesMaxNum and be a number', () => {
				assert.isDefined(actual.categoricalOutcomesMaxNum, 'categoricalOutcomesMaxNum is not defined');
				assert.isNumber(actual.categoricalOutcomesMaxNum, 'categoricalOutcomesMaxNum is not a number');
			});

			it('should receive categoricalOutcomeMaxLength and be a number', () => {
				assert.isDefined(actual.categoricalOutcomeMaxLength, 'categoricalOutcomeMaxLength is not defined');
				assert.isNumber(actual.categoricalOutcomeMaxLength, 'categoricalOutcomeMaxLength is not a number');
			});
			break;
		case 'scalar':
			it('should receive scalarSmallNum and be a number', () => {
				assert.isDefined(actual.scalarSmallNum, 'scalarSmallNum is not defined');
				assert.isNumber(actual.scalarSmallNum, 'scalarSmallNum is not a number');
			});

			it('should receive scalarBigNum and be a number', () => {
				assert.isDefined(actual.scalarBigNum, 'scalarBigNum is not defined');
				assert.isNumber(actual.scalarBigNum, 'scalarBigNum is not a number');
			});
			break;
		}
	});
}