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
	MAKER_FEE_MIN,
	MAKER_FEE_MAX,
	STARTING_QUANTITY_DEFAULT,
	STARTING_QUANTITY_MIN,
	BEST_STARTING_QUANTITY_DEFAULT,
	BEST_STARTING_QUANTITY_MIN,
	PRICE_WIDTH_DEFAULT,
	PRICE_WIDTH_MIN,
	PRICE_DEPTH_DEFAULT,
	IS_SIMULATION
} from '../../../../src/modules/create-market/constants/market-values-constraints';

import * as selector from '../../../../src/modules/create-market/selectors/form-steps/step-4';
import * as validateTradingFee from '../../../../src/modules/create-market/validators/validate-trading-fee';
import * as validateMakerFee from '../../../../src/modules/create-market/validators/validate-maker-fee';
import * as validateInitialLiquidity from '../../../../src/modules/create-market/validators/validate-initial-liquidity';
import * as validateInitialFairPrices from '../../../../src/modules/create-market/validators/validate-initial-fair-prices';
import * as validateBestStartingQuantity from '../../../../src/modules/create-market/validators/validate-best-starting-quantity';
import * as validateStartingQuantity from '../../../../src/modules/create-market/validators/validate-starting-quantity';
import * as validatePriceWidth from '../../../../src/modules/create-market/validators/validate-price-width';

import { formatPercent, formatEther, formatShares } from '../../../../src/utils/format-number';

import sinon from 'sinon';
import proxyquire from 'proxyquire';

describe(`modules/create-market/selectors/form-steps/step-4.js`, () => {
	// NOTE -- We've also implicitly tested `initialFairPrices` via these tests; thus, those tests are excluded.

	let formState,
		out,
		types = [ BINARY, CATEGORICAL, SCALAR ];

	// describe('select', () => {
	// 	beforeEach(() => {
	// 		formState = null;
	// 		out = null;
	// 	});
    //
	// 	it('should return the correct object for binary markets', () => {
	// 		formState = {
	// 			type: BINARY,
	// 			initialFairPrices: {
	// 				type: BINARY,
	// 				values: [],
	// 				raw: []
	// 			}
	// 		};
    //
	// 		out = {
	// 			tradingFeePercent: TRADING_FEE_DEFAULT,
	// 			makerFee: MAKER_FEE_DEFAULT,
	// 			initialLiquidity: INITIAL_LIQUIDITY_DEFAULT,
	// 			initialFairPrices: {
	// 				type: BINARY,
	// 				values: [
	// 					{
	// 						label: 'Yes',
	// 						value: 0.5
	// 					},
	// 					{
	// 						label: 'No',
	// 						value: 0.5
	// 					}
	// 				],
	// 				raw: [
	// 					0.5,
	// 					0.5
	// 				]
	// 			},
	// 			startingQuantity: STARTING_QUANTITY_DEFAULT,
	// 			bestStartingQuantity: BEST_STARTING_QUANTITY_DEFAULT,
	// 			priceWidth: PRICE_WIDTH_DEFAULT,
	// 			halfPriceWidth: PRICE_WIDTH_DEFAULT / 2,
	// 			priceDepth: PRICE_DEPTH_DEFAULT,
	// 			isSimulation: IS_SIMULATION
	// 		};
    //
	// 		assert.deepEqual(selector.select(formState), out, 'select does not return the correct object for a binary market');
	// 	});
    //
	// 	it('should return the correct object for categorical markets', () => {
	// 		formState = {
	// 			type: CATEGORICAL,
	// 			initialFairPrices: {
	// 				type: CATEGORICAL,
	// 				values: [],
	// 				raw: []
	// 			},
	// 			categoricalOutcomes: [
	// 				'test1',
	// 				'test2',
	// 				'test3'
	// 			]
	// 		};
    //
	// 		out = {
	// 			tradingFeePercent: TRADING_FEE_DEFAULT,
	// 			makerFee: MAKER_FEE_DEFAULT,
	// 			initialLiquidity: INITIAL_LIQUIDITY_DEFAULT,
	// 			initialFairPrices: {
	// 				type: CATEGORICAL,
	// 				values: [
	// 					{
	// 						label: 'test1',
	// 						value: 0.5
	// 					},
	// 					{
	// 						label: 'test2',
	// 						value: 0.5
	// 					},
	// 					{
	// 						label: 'test3',
	// 						value: 0.5
	// 					}
	// 				],
	// 				raw: [
	// 					0.5,
	// 					0.5,
	// 					0.5
	// 				]
	// 			},
	// 			startingQuantity: STARTING_QUANTITY_DEFAULT,
	// 			bestStartingQuantity: BEST_STARTING_QUANTITY_DEFAULT,
	// 			priceWidth: PRICE_WIDTH_DEFAULT,
	// 			halfPriceWidth: PRICE_WIDTH_DEFAULT / 2,
	// 			priceDepth: PRICE_DEPTH_DEFAULT,
	// 			isSimulation: IS_SIMULATION
	// 		};
    //
	// 		assert.deepEqual(selector.select(formState), out, 'select does not return the correct object for a categorical market');
	// 	});
	//
	// 	it('should return the correct object for scaler markets', () => {
	// 		formState = {
	// 			type: SCALAR,
	// 			initialFairPrices: {
	// 				type: SCALAR,
	// 				values: [],
	// 				raw: []
	// 			},
	// 			scalarSmallNum: 10,
	// 			scalarBigNum: 100
	// 		};
    //
	// 		out = {
	// 			tradingFeePercent: TRADING_FEE_DEFAULT,
	// 			makerFee: MAKER_FEE_DEFAULT,
	// 			initialLiquidity: INITIAL_LIQUIDITY_DEFAULT,
	// 			initialFairPrices: {
	// 				type: SCALAR,
	// 				values: [
	// 					{
	// 						label: '⇧',
	// 						value: 55
	// 					},
	// 					{
	// 						label: '⇩',
	// 						value: 55
	// 					}
	// 				],
	// 				raw: [
	// 					55,
	// 					55
	// 				]
	// 			},
	// 			startingQuantity: STARTING_QUANTITY_DEFAULT,
	// 			bestStartingQuantity: BEST_STARTING_QUANTITY_DEFAULT,
	// 			priceWidth: PRICE_WIDTH_DEFAULT,
	// 			halfPriceWidth: PRICE_WIDTH_DEFAULT / 2,
	// 			priceDepth: PRICE_DEPTH_DEFAULT,
	// 			isSimulation: IS_SIMULATION
	// 		};
    //
	// 		assert.deepEqual(selector.select(formState), out, 'select does not return the correct object for a scalar market');
	// 	});
	// });
    //
	// describe('validateTradingFee', () => {
	// 	let tradingFeePercent,
	// 		out;
    //
	// 	beforeEach(() => {
	// 		tradingFeePercent = null;
	// 		out = null;
	// 	});
    //
	// 	it('should validate a null or undefined state', () => {
	// 		out = 'Please specify a trading fee %';
    //
	// 		assert.deepEqual(selector.validateTradingFee(tradingFeePercent), out, 'null or undefined state was not validated correctly');
	// 	});
    //
	// 	it('should validate NaN', () => {
	// 		tradingFeePercent = 'test';
    //
	// 		out = 'Trading fee must be a number';
    //
	// 		assert.deepEqual(selector.validateTradingFee(tradingFeePercent), out, 'NaN value state was not validated correctly');
	// 	});
    //
	// 	it('should validate bounds', () => {
	// 		tradingFeePercent = TRADING_FEE_MIN - 0.1;
    //
	// 		out = `Trading fee must be between ${ formatPercent(TRADING_FEE_MIN, true).full } and ${ formatPercent(TRADING_FEE_MAX, true).full }`;
    //
	// 		assert.deepEqual(selector.validateTradingFee(tradingFeePercent), out, 'less than lower bound value state was not validated correctly');
    //
	// 		tradingFeePercent = TRADING_FEE_MAX + 0.1;
    //
	// 		assert.deepEqual(selector.validateTradingFee(tradingFeePercent), out, 'greater than upper bound value state was not validated correctly');
	// 	});
	// });
    

	describe('isValid', () => {
		proxyquire.noCallThru();

		let formState = {
				tradingFeePercent: null,
				makerFee: null,
				type: null,
				initialLiquidity: null,
				startingQuantity: null,
				bestStartingQuantity: null,
				halfPriceWidth: null,
				scalarSmallNum: null,
				scalarBigNum: null,
				initialFairPrices: {
					raw: null
				}
			},
			stubbedValidateTradingFee = sinon.stub(validateTradingFee, 'default', () => false),
			stubbedValidateMakerFee = sinon.stub(validateMakerFee, 'default', () => false),
			stubbedValidateInitialLiquidity = sinon.stub(validateInitialLiquidity, 'default', () => false),
			stubbedValidateInitialFairPrices = sinon.stub(validateInitialFairPrices, 'default', () => false),
			stubbedValidateBestStartingQuantity = sinon.stub(validateBestStartingQuantity, 'default', () => false),
			stubbedValidateStartingQuantity = sinon.stub(validateStartingQuantity, 'default', () => false),
			stubbedValidatePriceWidth = sinon.stub(validatePriceWidth, 'default', () => false);

		let proxiedSelector = proxyquire('../../../../src/modules/create-market/selectors/form-steps/step-4', {
			'../../validators/validate-trading-fee': stubbedValidateTradingFee,
			'../../validators/validate-maker-fee': stubbedValidateMakerFee,
			'../../validators/validate-initial-liquidity': stubbedValidateInitialLiquidity,
			'../../validators/validate-initial-fair-prices': stubbedValidateInitialFairPrices,
			'../../validators/validate-best-starting-quantity': stubbedValidateBestStartingQuantity,
			'../../validators/validate-starting-quantity': stubbedValidateStartingQuantity,
			'../../validators/validate-price-width': stubbedValidatePriceWidth
		});

		before(() => {
			proxiedSelector.isValid(formState);
		});

		after(() => {
			validateTradingFee.default.restore();
			validateMakerFee.default.restore();
			validateInitialLiquidity.default.restore();
			validateInitialFairPrices.default.restore();
			validateBestStartingQuantity.default.restore();
			validateStartingQuantity.default.restore();
			validatePriceWidth.default.restore();
		});

		it('calls validateTradingFee', () => {
			assert(stubbedValidateTradingFee.calledOnce, 'validateTradingFee was not called once');
		});

		it('calls validateMakerFee', () => {
			assert(stubbedValidateMakerFee.calledOnce, 'validateMakerFee was not called once');
		});

		it('calls validateInitialLiquidity', () => {
			assert(stubbedValidateInitialLiquidity.calledOnce, 'validateInitialLiquidity was not called once');
		});

		it('calls validateInitialFairPrices', () => {
			assert(stubbedValidateInitialFairPrices.calledOnce, 'validateInitialFairPrices was not called once');
		});

		it('calls validateBestStartingQuantity', () => {
			assert(stubbedValidateBestStartingQuantity.calledOnce, 'validateBestStartingQuantity was not called once');
		});

		it('calls validateStartingQuantity', () => {
			assert(stubbedValidateStartingQuantity.calledOnce, 'validateStartingQuantity was not called once');
		});

		it('calls validatePriceWidth', () => {
			assert(stubbedValidatePriceWidth.calledOnce, 'validatePriceWidth was not called once');
		});
	});

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
