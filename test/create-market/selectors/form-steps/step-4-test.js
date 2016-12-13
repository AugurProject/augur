import { describe, it, before, beforeEach, after } from 'mocha';
import { assert } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types';
import {
	TAKER_FEE_DEFAULT,
	INITIAL_LIQUIDITY_DEFAULT,
	MAKER_FEE_DEFAULT,
	STARTING_QUANTITY_DEFAULT,
	BEST_STARTING_QUANTITY_DEFAULT,
	PRICE_WIDTH_DEFAULT,
	PRICE_DEPTH_DEFAULT,
	IS_SIMULATION
} from 'modules/create-market/constants/market-values-constraints';

import * as selector from 'modules/create-market/selectors/form-steps/step-4';
import * as validateTakerFee from 'modules/create-market/validators/validate-taker-fee';
import * as validateMakerFee from 'modules/create-market/validators/validate-maker-fee';
import * as validateInitialLiquidity from 'modules/create-market/validators/validate-initial-liquidity';
import * as validateInitialFairPrices from 'modules/create-market/validators/validate-initial-fair-prices';
import * as validateBestStartingQuantity from 'modules/create-market/validators/validate-best-starting-quantity';
import * as validateStartingQuantity from 'modules/create-market/validators/validate-starting-quantity';
import * as validatePriceWidth from 'modules/create-market/validators/validate-price-width';

describe(`modules/create-market/selectors/form-steps/step-4.js`, () => {
	// NOTE -- We implicitly tested `initialFairPrices` via the `select` test.

	let formState;
	let out;
	const stubbedValidateTakerFee = sinon.stub(validateTakerFee, 'default', () => false);
	const stubbedValidateMakerFee = sinon.stub(validateMakerFee, 'default', () => false);
	const stubbedValidateInitialLiquidity = sinon.stub(validateInitialLiquidity, 'default', () => false);
	const stubbedValidateInitialFairPrices = sinon.stub(validateInitialFairPrices, 'default', () => false);
	const stubbedValidateBestStartingQuantity = sinon.stub(validateBestStartingQuantity, 'default', () => false);
	const stubbedValidateStartingQuantity = sinon.stub(validateStartingQuantity, 'default', () => false);
	const stubbedValidatePriceWidth = sinon.stub(validatePriceWidth, 'default', () => false);

	const proxiedSelector = proxyquire('../../../../src/modules/create-market/selectors/form-steps/step-4', {
		'../../validators/validate-taker-fee': stubbedValidateTakerFee,
		'../../validators/validate-maker-fee': stubbedValidateMakerFee,
		'../../validators/validate-initial-liquidity': stubbedValidateInitialLiquidity,
		'../../validators/validate-initial-fair-prices': stubbedValidateInitialFairPrices,
		'../../validators/validate-best-starting-quantity': stubbedValidateBestStartingQuantity,
		'../../validators/validate-starting-quantity': stubbedValidateStartingQuantity,
		'../../validators/validate-price-width': stubbedValidatePriceWidth
	});

	after(() => {
		validateTakerFee.default.restore();
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

		it('should return the correct object for markets WITHOUT an initial order book', () => {
			formState = {};

			out = {
				takerFee: TAKER_FEE_DEFAULT,
				makerFee: MAKER_FEE_DEFAULT
			};

			assert.deepEqual(selector.select(formState), out, 'select does not return the correct object for a binary market');
		});

		it('should return the correct object for binary markets WITH an initial order book', () => {
			formState = {
				type: BINARY,
				isCreatingOrderBook: true,
				initialFairPrices: {
					type: BINARY,
					values: [],
					raw: []
				}
			};

			out = {
				takerFee: TAKER_FEE_DEFAULT,
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

		it('should return the correct object for categorical markets WITH an initial order book', () => {
			formState = {
				type: CATEGORICAL,
				isCreatingOrderBook: true,
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
				takerFee: TAKER_FEE_DEFAULT,
				makerFee: MAKER_FEE_DEFAULT,
				initialLiquidity: INITIAL_LIQUIDITY_DEFAULT,
				initialFairPrices: {
					type: CATEGORICAL,
					values: [
						{
							label: 'test1',
							value: 0.3333
						},
						{
							label: 'test2',
							value: 0.3333
						},
						{
							label: 'test3',
							value: 0.3333
						}
					],
					raw: [
						0.3333,
						0.3333,
						0.3333
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

		it('should return the correct object for scaler markets WITH an initial order book', () => {
			formState = {
				type: SCALAR,
				isCreatingOrderBook: true,
				initialFairPrices: {
					type: SCALAR,
					values: [],
					raw: []
				},
				scalarSmallNum: 10,
				scalarBigNum: 100
			};

			out = {
				takerFee: TAKER_FEE_DEFAULT,
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
				takerFee: null,
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
		});

		describe('isCreatingOrderBook false', () => {
			before(() => {
				proxiedSelector.isValid(formState);
			});

			after(() => {
				validateTakerFee.default.reset();
				validateMakerFee.default.reset();
				validateInitialLiquidity.default.reset();
				validateInitialFairPrices.default.reset();
				validateBestStartingQuantity.default.reset();
				validateStartingQuantity.default.reset();
				validatePriceWidth.default.reset();
			});

			it('calls validateTakerFee', () => {
				assert(stubbedValidateTakerFee.calledOnce, 'validateTakerFee was not called once');
			});

			it('calls validateMakerFee', () => {
				assert(stubbedValidateMakerFee.calledOnce, 'validateMakerFee was not called once');
			});

			it('calls validateInitialLiquidity', () => {
				assert(stubbedValidateInitialLiquidity.notCalled, 'validateInitialLiquidity was called');
			});

			it('calls validateInitialFairPrices', () => {
				assert(stubbedValidateInitialFairPrices.notCalled, 'validateInitialFairPrices was called');
			});

			it('calls validateBestStartingQuantity', () => {
				assert(stubbedValidateBestStartingQuantity.notCalled, 'validateBestStartingQuantity was called');
			});

			it('calls validateStartingQuantity', () => {
				assert(stubbedValidateStartingQuantity.notCalled, 'validateStartingQuantity was called');
			});

			it('calls validatePriceWidth', () => {
				assert(stubbedValidatePriceWidth.notCalled, 'validatePriceWidth was called ');
			});
		});

		describe('isCreatingOrderBook true', () => {
			before(() => {
				formState = {
					...formState,
					isCreatingOrderBook: true
				};

				proxiedSelector.isValid(formState);
			});

			after(() => {
				validateTakerFee.default.reset();
				validateMakerFee.default.reset();
				validateInitialLiquidity.default.reset();
				validateInitialFairPrices.default.reset();
				validateBestStartingQuantity.default.reset();
				validateStartingQuantity.default.reset();
				validatePriceWidth.default.reset();
			});

			it('calls validateTakerFee', () => {
				assert(stubbedValidateTakerFee.calledOnce, 'validateTakerFee was not called once');
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

	describe('errors', () => {
		proxyquire.noCallThru();

		before(() => {
			formState = {
				takerFee: TAKER_FEE_DEFAULT,
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

		it('calls validateTakerFee', () => {
			assert(stubbedValidateTakerFee.calledOnce, 'validateTakerFee was not called once');
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
