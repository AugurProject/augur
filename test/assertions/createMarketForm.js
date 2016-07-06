import { assert } from 'chai';

import endDateShape from '../../test/assertions/common/endDateShape';
import initialFairPricesShape from '../../test/assertions/common/initialFairPricesShape';
import numberShape from '../../test/assertions/common/numberShape';

function step1(actual){
	describe('augur-ui-react-components createMarketForm step-1 initial state', () => {
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

function step2(actual){
	describe(`augur-ui-react-components createMarketForm step-2 ${actual.type} market initial state`, () => {
		it('should receive type and be a string', () => {
			assert.isDefined(actual.type, 'type is not defined');
			assert.isString(actual.type, 'type is not a string');
		});

		it('should receive initialFairPrices and be an object with correct shape', () => {
			assert.isDefined(actual.initialFairPrices, 'initialFairPrices is not defined');
			assert.isObject(actual.initialFairPrices, 'initialFairPrices is not an object');
			initialFairPricesShape(actual.initialFairPrices, 'createMarketForm');
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

function step3(actual){
	describe('augur-ui-react-components createMarketForm step-3 initial state', () => {
		it('should receive description and be a string', () => {
			assert.isDefined(actual.description, 'description is not defined');
			assert.isString(actual.description, 'description is not a string');
		});

		it('should receive tagMaxNum and be a number', () => {
			assert.isDefined(actual.tagsMaxNum, 'tagsMaxNum is not defined');
			assert.isNumber(actual.tagsMaxNum, 'tagsMaxNum is not a number');
		});

		it('should receive tagsMaxLength and be a number', () => {
			assert.isDefined(actual.tagMaxLength, 'tagsMaxLength is not defined');
			assert.isNumber(actual.tagMaxLength, 'tagsMaxLength is not a number');
		});
	});
}

function step4(actual){
	describe('augur-ui-react-components createMarketForm step-4 initial state', () => {
		it('should receive takerFee and be a number', () => {
			assert.isDefined(actual.takerFee, 'makerFee is not defined');
			assert.isNumber(actual.takerFee, 'makerFee is not a number');
		});

		it('should receive makerFee and be a number', () => {
			assert.isDefined(actual.makerFee, 'makerFee is not defined');
			assert.isNumber(actual.makerFee, 'makerFee is not a number');
		});

		it('should receive initialLiquidity and be a number', () => {
			assert.isDefined(actual.initialLiquidity, 'initialLiquidity is not defined');
			assert.isNumber(actual.initialLiquidity, 'initialLiquidity is not a number');
		});

		it('should receive initialFairPrices and be an object with correct shape', () => {
			assert.isDefined(actual.initialFairPrices, 'initialFairPrices is not defined');
			assert.isObject(actual.initialFairPrices, 'initialFairPrices is not an object');
			initialFairPricesShape(actual.initialFairPrices, 'createMarketForm');
		});

		it('should receive bestStartingQuantity and be a number', () => {
			assert.isDefined(actual.bestStartingQuantity, 'bestStartingQuantity is not defined');
			assert.isNumber(actual.bestStartingQuantity, 'bestStartingQuantity is not a number');
		});

		it('should receive startingQuantity and be a number', () => {
			assert.isDefined(actual.startingQuantity, 'startingQuantity is not defined');
			assert.isNumber(actual.startingQuantity, 'startingQuantity is not a number');
		});

		it('should receive priceWidth and be a number', () => {
			assert.isDefined(actual.priceWidth, 'priceWidth is not defined');
			assert.isNumber(actual.priceWidth, 'priceWidth is not a number');
		});

		it('should receive priceDepth and be a number', () => {
			assert.isDefined(actual.priceDepth, 'priceDepth is not defined');
			assert.isNumber(actual.priceDepth, 'priceDepth is not a number');
		});
	});
}

function step5(actual){
	describe('augur-ui-react-components createMarketForm step-5 initial state', () => {
		it('should receive description and be a string', () => {
			assert.isDefined(actual.description, 'description is not defined');
			assert.isString(actual.description, 'description is not a string');
		});

		it('should receive outcomes and be an array', () => {
			assert.isDefined(actual.outcomes, 'outcomes is not defined');
			assert.isArray(actual.outcomes, 'outcomes is not an array');
		});

		it('should receive endDate and be an object with correct shape', () => {
			assert.isDefined(actual.endDate, 'endDate is not defined');
			assert.isObject(actual.endDate, 'endDate is not an array');
			endDateShape(actual.endDate);
		});

		it('should receive takerFeePercent and be an object with correct shape', () => {
			assert.isDefined(actual.takerFeePercent, 'takerFeePercent is not defined');
			assert.isObject(actual.takerFeePercent, 'takerFeePercent is not an object');
			numberShape(actual.takerFeePercent, 'createMarketForm.takerFeePercent');
		});

		it('should receive makerFeePercent and be an object with correct shape', () => {
			assert.isDefined(actual.makerFeePercent, 'makerFeePercent is not defined');
			assert.isObject(actual.makerFeePercent, 'makerFeePercent is not an object');
			numberShape(actual.makerFeePercent, 'createMarketForm.makerFeePercent');
		});

		it('should receive creatingMarket and be a boolean', () => {
			assert.isDefined(actual.creatingMarket, 'creatingMarket is not defined');
			assert.isBoolean(actual.creatingMarket, 'creatingMarket is not a boolean');
		});

		it('should receive volume and be an object with correct shape', () => {
			assert.isDefined(actual.volume, 'volume is not defined');
			assert.isObject(actual.volume, 'volume is not an object');
			numberShape(actual.volume, 'createMarketForm.volume');
		});

		it('should receive initialFairPrices and be an object with correct shape', () => {
			assert.isDefined(actual.initialFairPrices, 'initialFairPrices is not defined');
			assert.isObject(actual.initialFairPrices, 'initialFairPrices is not an object');
			initialFairPricesShape(actual.initialFairPrices, 'createMarketForm');
		});

		it('should receive bestStartingQuantityFormatted and be an object with correct shape', () => {
			assert.isDefined(actual.bestStartingQuantityFormatted, 'bestStartingQuantityFormatted is not defined');
			assert.isObject(actual.bestStartingQuantityFormatted, 'bestStartingQuantityFormatted is not an object');
			numberShape(actual.bestStartingQuantityFormatted, 'createMarketForm.bestStartingQuantityFormatted');
		});

		it('should receive startingQuantityFormatted and be an object with correct shape', () => {
			assert.isDefined(actual.startingQuantityFormatted, 'startingQuantityFormatted is not defined');
			assert.isObject(actual.startingQuantityFormatted, 'startingQuantityFormatted is not an object');
			numberShape(actual.startingQuantityFormatted, 'createMarketForm.startingQuantityFormatted');
		});

		it('should receive priceWidthFormatted and be an object with correct shape', () => {
			assert.isDefined(actual.priceWidthFormatted, 'priceWidthFormatted is not defined');
			assert.isObject(actual.priceWidthFormatted, 'priceWidthFormatted is not an object');
			numberShape(actual.priceWidthFormatted, 'createMarketForm.priceWidthFormatted');
		});
	});
}

module.exports = {
	step1,
	step2,
	step3,
	step4,
	step5
};