import {
	assert
} from 'chai';

import {
	BINARY,
	CATEGORICAL,
	SCALAR
} from '../../../../src/modules/markets/constants/market-types';

import {
	TRADING_FEE_MIN,
	TRADING_FEE_MAX,
	INITIAL_LIQUIDITY_MIN,
	TRADING_FEE_DEFAULT,
	INITIAL_LIQUIDITY_DEFAULT,
	MAKER_FEE_DEFAULT,
	STARTING_QUANTITY_DEFAULT,
	BEST_STARTING_QUANTITY_DEFAULT,
	PRICE_WIDTH_DEFAULT,
	PRICE_DEPTH_DEFAULT,
	IS_SIMULATION
} from '../../../../src/modules/create-market/constants/market-values-constraints';

import * as selector from '../../../../src/modules/create-market/selectors/form-steps/step-4';

import sinon from 'sinon';

describe(`modules/create-market/selectors/form-steps/step-4.js`, () => {
	let formState,
		out;

	describe('select', () => {
		beforeEach(() => {
			formState = null;
			out = null;
		});

		it('should return the correct object for binary markets', () => {
			formState = {
				type: BINARY,
				initialFairPrices: {
					type: BINARY,
					values: [],
					raw: []
				}
			};

			out = {
				tradingFeePercent: TRADING_FEE_DEFAULT,
				makerFee: MAKER_FEE_DEFAULT,
				initialLiquidity: INITIAL_LIQUIDITY_DEFAULT,
				initialFairPrices: {
					type: BINARY,
					values: [
						{
							label: 'Yes',
							value: 0.5
						},
						{
							label: 'No',
							value: 0.5
						}
					],
					raw: [
						0.5,
						0.5
					]
				},
				startingQuantity: STARTING_QUANTITY_DEFAULT,
				bestStartingQuantity: BEST_STARTING_QUANTITY_DEFAULT,
				priceWidth: PRICE_WIDTH_DEFAULT,
				halfPriceWidth: PRICE_WIDTH_DEFAULT / 2,
				priceDepth: PRICE_DEPTH_DEFAULT,
				isSimulation: IS_SIMULATION
			};

			assert.deepEqual(selector.select(formState), out, 'select does not return the correct object for a binary market');
		});

		it('should return the correct object for categorical markets', () => {
			formState = {
				type: CATEGORICAL,
				initialFairPrices: {
					type: CATEGORICAL,
					values: [],
					raw: []
				},
				categoricalOutcomes: [
					'test1',
					'test2',
					'test3'
				]
			};

			out = {
				tradingFeePercent: TRADING_FEE_DEFAULT,
				makerFee: MAKER_FEE_DEFAULT,
				initialLiquidity: INITIAL_LIQUIDITY_DEFAULT,
				initialFairPrices: {
					type: CATEGORICAL,
					values: [
						{
							label: 'test1',
							value: 0.5
						},
						{
							label: 'test2',
							value: 0.5
						},
						{
							label: 'test3',
							value: 0.5
						}
					],
					raw: [
						0.5,
						0.5,
						0.5
					]
				},
				startingQuantity: STARTING_QUANTITY_DEFAULT,
				bestStartingQuantity: BEST_STARTING_QUANTITY_DEFAULT,
				priceWidth: PRICE_WIDTH_DEFAULT,
				halfPriceWidth: PRICE_WIDTH_DEFAULT / 2,
				priceDepth: PRICE_DEPTH_DEFAULT,
				isSimulation: IS_SIMULATION
			};

			assert.deepEqual(selector.select(formState), out, 'select does not return the correct object for a categorical market');
		});
		
		it('should return the correct object for scaler markets', () => {
			formState = {
				type: SCALAR,
				initialFairPrices: {
					type: SCALAR,
					values: [],
					raw: []
				},
				scalarSmallNum: 10,
				scalarBigNum: 100
			};

			out = {
				tradingFeePercent: TRADING_FEE_DEFAULT,
				makerFee: MAKER_FEE_DEFAULT,
				initialLiquidity: INITIAL_LIQUIDITY_DEFAULT,
				initialFairPrices: {
					type: SCALAR,
					values: [
						{
							label: '⇧',
							value: 55
						},
						{
							label: '⇩',
							value: 55
						}
					],
					raw: [
						55,
						55
					]
				},
				startingQuantity: STARTING_QUANTITY_DEFAULT,
				bestStartingQuantity: BEST_STARTING_QUANTITY_DEFAULT,
				priceWidth: PRICE_WIDTH_DEFAULT,
				halfPriceWidth: PRICE_WIDTH_DEFAULT / 2,
				priceDepth: PRICE_DEPTH_DEFAULT,
				isSimulation: IS_SIMULATION
			};

			assert.deepEqual(selector.select(formState), out, 'select does not return the correct object for a scalar market');
		});
	});

	it(`[TODO] should handle validation of step 4`);

	// () => {
	// 	formState = {
	// 		tradingFeePercent: '',
	// 		initialLiquidity: ''
	// 	};
    //
	// 	assert(!selector.isValid(formState), `Didn't invalidate a blank tradingFeePercent`);
    //
	// 	formState.tradingFeePercent = 'testNonNumeric';
	// 	assert(!selector.isValid(formState), `Didn't invalidate a tradingFeePercent that wasn't a number`);
    //
	// 	formState.tradingFeePercent = (TRADING_FEE_MIN - 1);
	// 	assert(!selector.isValid(formState), `Didn't invalidate a tradingFeePercent that is below the Trading Fee min`);
    //
	// 	formState.tradingFeePercent = (TRADING_FEE_MAX + 1);
	// 	assert(!selector.isValid(formState), `Didn't invalidate a tradingFeePercent that is above the Trading Fee max`);
    //
	// 	formState.tradingFeePercent = TRADING_FEE_DEFAULT;
	// 	assert(!selector.isValid(formState), `Didn't invalidate a initialLiquidity of empty string`);
    //
	// 	formState.initialLiquidity = 'testNonNumeric';
	// 	assert(!selector.isValid(formState), `Didn't invalidate a non numeric initialLiquidity`);
    //
	// 	formState.initialLiquidity = (INITIAL_LIQUIDITY_MIN - 1);
	// 	assert(!selector.isValid(formState), `Didn't invalidate a initialLiquidity that was below the minumum`);
    //
	// 	formState.initialLiquidity = (INITIAL_LIQUIDITY_MIN + 10);
	// 	assert(selector.isValid(formState), `Didn't validate a valid formState`);
	// }

	it(`should handle errors in step 4`, () => {
		// formState = {
		// 	tradingFeePercent: '',
		// 	initialLiquidity: ''
		// };
		// out = {
		// 	tradingFeePercent: 'Please specify a trading fee %',
		// 	initialLiquidity: 'Please provide some initial liquidity'
		// };
		// assert.deepEqual(selector.errors(formState), out, `Didn't error on a blank tradingFeePercent`);
        //
		// formState.tradingFeePercent = 'testNonNumeric';
		// out = {
		// 	tradingFeePercent: 'Trading fee must be a number',
		// 	initialLiquidity: 'Please provide some initial liquidity'
		// };
		// assert.deepEqual(selector.errors(formState), out, `Didn't error on a tradingFeePercent that wasn't a number`);
        //
		// formState.tradingFeePercent = (TRADING_FEE_MIN - 1);
		// out = {
		// 	tradingFeePercent: 'Please specify a trading fee %',
		// 	initialLiquidity: 'Please provide some initial liquidity'
		// };
		// assert.deepEqual(selector.errors(formState), out, `Didn't error on a tradingFeePercent that is below the Trading Fee min`);
        //
		// formState.tradingFeePercent = (TRADING_FEE_MAX + 1);
		// out = {
		// 	tradingFeePercent: 'Trading fee must be between +1.0% and +12.5%',
		// 	initialLiquidity: 'Please provide some initial liquidity'
		// };
		// assert.deepEqual(selector.errors(formState), out, `Didn't error on a tradingFeePercent that is above the Trading Fee max`);
        //
		// formState.tradingFeePercent = TRADING_FEE_DEFAULT;
		// out = {
		// 	tradingFeePercent: undefined,
		// 	initialLiquidity: 'Please provide some initial liquidity'
		// };
		// assert.deepEqual(selector.errors(formState), out, `Didn't error on a initialLiquidity of empty string`);
        //
		// formState.initialLiquidity = 'testNonNumeric';
		// out = {
		// 	tradingFeePercent: undefined,
		// 	initialLiquidity: 'Initial liquidity must be numeric'
		// };
		// assert.deepEqual(selector.errors(formState), out, `Didn't error on a non numeric initialLiquidity`);
        //
		// formState.initialLiquidity = (INITIAL_LIQUIDITY_MIN - 1);
		// out = {
		// 	tradingFeePercent: undefined,
		// 	initialLiquidity: 'Insufficient liquidity based on advanced parameters'
		// };
		// assert.deepEqual(selector.errors(formState), out, `Didn't error on a initialLiquidity that was below the minumum`);

		// TODO -- requires a more filled out formState to properly test
		// formState.initialLiquidity = (INITIAL_LIQUIDITY_MIN + 10);
		// out = {
		// 	tradingFeePercent: undefined,
		// 	initialLiquidity: undefined
		// };
		// assert.deepEqual(selector.errors(formState), out, `Didn't return no errors for a valid formState`);

	});
});
