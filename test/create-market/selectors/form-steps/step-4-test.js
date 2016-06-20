import {
	assert
} from 'chai';
import {
	BINARY,
	CATEGORICAL,
	SCALAR
} from '../../../../src/modules/markets/constants/market-types';
import {
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
import * as validateTradingFee from '../../../../src/modules/create-market/validators/validate-trading-fee';
import * as validateMakerFee from '../../../../src/modules/create-market/validators/validate-maker-fee';
import * as validateInitialLiquidity from '../../../../src/modules/create-market/validators/validate-initial-liquidity';
import * as validateInitialFairPrices from '../../../../src/modules/create-market/validators/validate-initial-fair-prices';
import * as validateBestStartingQuantity from '../../../../src/modules/create-market/validators/validate-best-starting-quantity';
import * as validateStartingQuantity from '../../../../src/modules/create-market/validators/validate-starting-quantity';
import * as validatePriceWidth from '../../../../src/modules/create-market/validators/validate-price-width';

import sinon from 'sinon';
import proxyquire from 'proxyquire';

describe(`modules/create-market/selectors/form-steps/step-4.js`, () => {
	// NOTE -- We implicitly test `initialFairPrices` via the `select` test.

	let formState,
		out,
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

	after(() => {
		validateTradingFee.default.restore();
		validateMakerFee.default.restore();
		validateInitialLiquidity.default.restore();
		validateInitialFairPrices.default.restore();
		validateBestStartingQuantity.default.restore();
		validateStartingQuantity.default.restore();
		validatePriceWidth.default.restore();
	});

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

	describe('isValid', () => {
		proxyquire.noCallThru();

		before(() => {
			formState = {
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
			};

			proxiedSelector.isValid(formState);
		});

		it('calls validateTradingFee', () => {
			assert(stubbedValidateTradingFee.calledOnce, 'validateTradingFee was not called once');
			validateTradingFee.default.reset();
		});

		it('calls validateMakerFee', () => {
			assert(stubbedValidateMakerFee.calledOnce, 'validateMakerFee was not called once');
			validateMakerFee.default.reset();
		});

		it('calls validateInitialLiquidity', () => {
			assert(stubbedValidateInitialLiquidity.calledOnce, 'validateInitialLiquidity was not called once');
			validateInitialLiquidity.default.reset();
		});

		it('calls validateInitialFairPrices', () => {
			assert(stubbedValidateInitialFairPrices.calledOnce, 'validateInitialFairPrices was not called once');
			validateInitialFairPrices.default.reset();
		});

		it('calls validateBestStartingQuantity', () => {
			assert(stubbedValidateBestStartingQuantity.calledOnce, 'validateBestStartingQuantity was not called once');
			validateBestStartingQuantity.default.reset();
		});

		it('calls validateStartingQuantity', () => {
			assert(stubbedValidateStartingQuantity.calledOnce, 'validateStartingQuantity was not called once');
			validateStartingQuantity.default.reset();
		});

		it('calls validatePriceWidth', () => {
			assert(stubbedValidatePriceWidth.calledOnce, 'validatePriceWidth was not called once');
			validatePriceWidth.default.reset();
		});
	});

	describe('errors', () => {
		proxyquire.noCallThru();
    
		before(() => {
			formState = {
				tradingFeePercent: TRADING_FEE_DEFAULT,
				makerFee: MAKER_FEE_DEFAULT,
				type: BINARY,
				initialLiquidity: INITIAL_LIQUIDITY_DEFAULT,
				startingQuantity: STARTING_QUANTITY_DEFAULT,
				bestStartingQuantity: BEST_STARTING_QUANTITY_DEFAULT,
				priceWidth: PRICE_WIDTH_DEFAULT,
				scalarSmallNum: 10,
				scalarBigNum: 100,
				initialFairPrices: {
					raw: [0.5, 0.5]
				}
			};

			proxiedSelector.errors(formState);
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
});
