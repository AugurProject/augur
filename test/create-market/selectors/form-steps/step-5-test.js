import chai, {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../../testState';

import { CREATE_MARKET } from '../../../../src/modules/transactions/constants/types';

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

import * as selector from '../../../../src/modules/create-market/selectors/form-steps/step-5';
import * as submitNewMarket from '../../../../src/modules/create-market/actions/submit-new-market';

describe(`modules/create-market/selectors/form-steps/step-5.js`, () => {
	proxyquire.noPreserveCache().noCallThru();

	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);

	let formState,
		out,
		outAction,
		state = Object.assign({}, testState),
		store = mockStore(state);

	console.log('submitNewMarket -- ', submitNewMarket);

	let stubbedSubmitNewMarket = sinon.stub(submitNewMarket, 'submitNewMarket', () => ({ type: CREATE_MARKET }));

	// stubbedSubmit.submitNewMarket = sinon.stub().returns({
	// 	type: 'SUBMIT_NEW_MARKET'
	// });

	let proxiedSelector = proxyquire('../../../../src/modules/create-market/selectors/form-steps/step-5', {
		'../../../create-market/actions/submit-new-market': stubbedSubmitNewMarket
	});

	describe('select', () => {
		before(() => {
			formState = {
				endDate: new Date(3000, 0, 1, 0, 0, 0, 0),
				tradingFeePercent: TRADING_FEE_DEFAULT,
				makerFee: MAKER_FEE_DEFAULT,
				bestStartingQuantity: BEST_STARTING_QUANTITY_DEFAULT,
				startingQuantity: STARTING_QUANTITY_DEFAULT,
				priceWidth: PRICE_WIDTH_DEFAULT,
				expirySource: 'testing',
				type: BINARY,
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
				}
			};

			outAction = [store.dispatch(stubbedSubmitNewMarket())];
			store.clearActions();
		});

		it('should call the correct action onSubmit', () => {
			let select = selector.select(
				formState,
				state.blockchain.currentBlockNumber,
				state.blockchain.currentBlockMillisSinceEpoch,
				store.dispatch
			);

			select.onSubmit();

			assert.deepEqual(store.getActions(), outAction, `Didn't dispatch the expected action object when onSubmit was called`);
		});

		it('should return the correct object for a binary market', () => {
			formState = {
				...formState,
				type: BINARY,
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
				}
			};

			let select = selector.select(
				formState,
				state.blockchain.currentBlockNumber,
				state.blockchain.currentBlockMillisSinceEpoch,
				store.dispatch
			);
    
			out = {
				type: BINARY,
				expirySource: 'testing',
				makerFee: 0.005,
				endDate: {
					value: new Date(3000, 0, 1, 0, 0, 0, 0),
					formatted: 'Jan 1, 3000',
					full: new Date(3000, 0, 1, 0, 0, 0, 0).toISOString()
				},
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
					raw: [ 0.5, 0.5 ],
					formatted: [
						{
							denomination: "ETH | Yes",
			        		formatted: "0.5",
				        	formattedValue: 0.5,
							full: "0.5ETH | Yes",
							minimized: "0.5",
							rounded: "1",
							roundedValue: 1,
							value: 0.5
						},
						{
							denomination: "ETH | No",
							formatted: "0.5",
							formattedValue: 0.5,
							full: "0.5ETH | No",
							minimized: "0.5",
							rounded: "1",
							roundedValue: 1,
							value: 0.5
				  		}
					]
				},
				outcomes: [
					{
						id: 1,
						name: "No"
					},
					{
						id: 2,
						name: "Yes"
					}
				],
				priceWidth: PRICE_WIDTH_DEFAULT,
				tradingFeePercent: {
					value: 2,
					formattedValue: 2,
					formatted: '+2.0',
					roundedValue: 2,
					rounded: '+2',
					minimized: '+2',
					denomination: '%',
					full: '+2.0%'
				},
				makerFeePercent: {
					value: 0.5,
					formattedValue: 0.5,
					formatted: '+0.5',
					roundedValue: 1,
					rounded: '+1',
					minimized: '+0.5',
					denomination: '%',
					full: '+0.5%'
				},
				endBlock: select.endBlock,
				tradingFee: TRADING_FEE_DEFAULT / 100,
				takerFeePercent: {
					value: 99.5,
					formattedValue: 99.5,
					formatted: '+99.5',
					roundedValue: 100,
					rounded: '+100',
					minimized: '+99.5',
					denomination: '%',
					full: '+99.5%'
				},
				volume: {
					value: 0,
					formattedValue: 0,
					formatted: '-',
					roundedValue: 0,
					rounded: '-',
					minimized: '-',
					denomination: '',
					full: '-'
				},
				bestStartingQuantity: BEST_STARTING_QUANTITY_DEFAULT,
			  	bestStartingQuantityFormatted: {
					denomination: "Shares",
					formatted: "20",
					formattedValue: 20,
					full: "20Shares",
					minimized: "20",
					rounded: "20",
					roundedValue: 20,
					value: 20
				},
				priceWidthFormatted: {
					denomination: "ETH",
					formatted: "0.1",
					formattedValue: 0.1,
					full: "0.1ETH",
					minimized: "0.1",
					rounded: "0",
					roundedValue: 0,
					value: 0.1
				},
				startingQuantity: STARTING_QUANTITY_DEFAULT,
				startingQuantityFormatted: {
					denomination: "Shares",
					formatted: "10",
					formattedValue: 10,
					full: "10Shares",
					minimized: "10",
					rounded: "10",
					roundedValue: 10,
					value: 10
				},
				isFavorite: false
			};

			delete select['onSubmit']; // Exclude onSubmit function from object comparison assertion
    
			assert.deepEqual(
				select,
				out,
				`correct object was not returned`
			);
		});

		it('should return the correct object for a categorical market', () => {
			formState = {
				...formState,
				type: CATEGORICAL,
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
				categoricalOutcomes: [
					'test1',
					'test2',
					'test3'
				]
			};

			let select = selector.select(
				formState,
				state.blockchain.currentBlockNumber,
				state.blockchain.currentBlockMillisSinceEpoch,
				store.dispatch
			);

			out = {
				type: CATEGORICAL,
				expirySource: 'testing',
				makerFee: 0.005,
				endDate: {
					value: new Date(3000, 0, 1, 0, 0, 0, 0),
					formatted: 'Jan 1, 3000',
					full: new Date(3000, 0, 1, 0, 0, 0, 0).toISOString()
				},
				categoricalOutcomes: [
					'test1',
					'test2',
					'test3'
				],
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
					raw: [ 0.5, 0.5, 0.5 ],
					formatted: [
						{
							denomination: "ETH | test1",
							formatted: "0.5",
							formattedValue: 0.5,
							full: "0.5ETH | test1",
							minimized: "0.5",
							rounded: "1",
							roundedValue: 1,
							value: 0.5
						},
						{
							denomination: "ETH | test2",
							formatted: "0.5",
							formattedValue: 0.5,
							full: "0.5ETH | test2",
							minimized: "0.5",
							rounded: "1",
							roundedValue: 1,
							value: 0.5
						},
						{
							denomination: "ETH | test3",
							formatted: "0.5",
							formattedValue: 0.5,
							full: "0.5ETH | test3",
							minimized: "0.5",
							rounded: "1",
							roundedValue: 1,
							value: 0.5
						}
					]
				},
				outcomes: [
					{
						id: 0,
						name: "test1"
					},
					{
						id: 1,
						name: "test2"
					},
					{
						id: 2,
						name: "test3"
					}
				],
				priceWidth: PRICE_WIDTH_DEFAULT,
				tradingFeePercent: {
					value: 2,
					formattedValue: 2,
					formatted: '+2.0',
					roundedValue: 2,
					rounded: '+2',
					minimized: '+2',
					denomination: '%',
					full: '+2.0%'
				},
				makerFeePercent: {
					value: 0.5,
					formattedValue: 0.5,
					formatted: '+0.5',
					roundedValue: 1,
					rounded: '+1',
					minimized: '+0.5',
					denomination: '%',
					full: '+0.5%'
				},
				endBlock: select.endBlock,
				tradingFee: TRADING_FEE_DEFAULT / 100,
				takerFeePercent: {
					value: 99.5,
					formattedValue: 99.5,
					formatted: '+99.5',
					roundedValue: 100,
					rounded: '+100',
					minimized: '+99.5',
					denomination: '%',
					full: '+99.5%'
				},
				volume: {
					value: 0,
					formattedValue: 0,
					formatted: '-',
					roundedValue: 0,
					rounded: '-',
					minimized: '-',
					denomination: '',
					full: '-'
				},
				bestStartingQuantity: BEST_STARTING_QUANTITY_DEFAULT,
				bestStartingQuantityFormatted: {
					denomination: "Shares",
					formatted: "20",
					formattedValue: 20,
					full: "20Shares",
					minimized: "20",
					rounded: "20",
					roundedValue: 20,
					value: 20
				},
				priceWidthFormatted: {
					denomination: "ETH",
					formatted: "0.1",
					formattedValue: 0.1,
					full: "0.1ETH",
					minimized: "0.1",
					rounded: "0",
					roundedValue: 0,
					value: 0.1
				},
				startingQuantity: STARTING_QUANTITY_DEFAULT,
				startingQuantityFormatted: {
					denomination: "Shares",
					formatted: "10",
					formattedValue: 10,
					full: "10Shares",
					minimized: "10",
					rounded: "10",
					roundedValue: 10,
					value: 10
				},
				isFavorite: false
			};

			delete select['onSubmit']; // Exclude onSubmit function from object comparison assertion

			assert.deepEqual(
				select,
				out,
				`correct object was not returned`
			);
		});

		it('should return the correct object for a scalar market');
	});

	it('[TODO] should return a new market');

		// () => {
		// 	formState = {
		// 		type: 'scalar',
		// 		endDate: new Date(3000, 0, 1, 0, 0, 0, 0),
		// 		tradingFeePercent: 5,
		// 		expirySource: 'test',
		// 		categoricalOutcomes: {
		// 			test1: {},
		// 			test2: {}
		// 		},
		// 		scalarSmallNum: 5,
		// 		scalarBigNum: 50
		// 	};
        //
		// 	let test = selector.select(formState, state.blockchain.currentBlockNumber, state.blockchain.currentBlockMillisSinceEpoch, store.dispatch);
        //
		// 	test.onSubmit();
        //
		// 	out = {
		// 		type: 'scalar',
		// 		endDate: {
		// 			value: new Date(3000, 0, 1, 0, 0, 0, 0),
		// 			formatted: 'Jan 1, 3000',
		// 			full: new Date(3000, 0, 1, 0, 0, 0, 0).toISOString()
		// 		},
		// 		tradingFeePercent: {
		// 			value: 5,
		// 			formattedValue: 5,
		// 			formatted: '+5.0',
		// 			roundedValue: 5,
		// 			rounded: '+5',
		// 			minimized: '+5',
		// 			denomination: '%',
		// 			full: '+5.0%'
		// 		},
		// 		expirySource: 'test',
		// 		categoricalOutcomes: {
		// 			test1: {},
		// 			test2: {}
		// 		},
		// 		scalarSmallNum: 5,
		// 		scalarBigNum: 50,
		// 		endBlock: test.endBlock,
		// 		tradingFee: 0.05,
		// 		volume: {
		// 			value: 0,
		// 			formattedValue: 0,
		// 			formatted: '-',
		// 			roundedValue: 0,
		// 			rounded: '-',
		// 			minimized: '-',
		// 			denomination: '',
		// 			full: '-'
		// 		},
		// 		outcomes: [{
		// 			id: 1,
		// 			name: 5
		// 		}, {
		// 			id: 2,
		// 			name: 50
		// 		}],
		// 		isFavorite: false,
		// 		onSubmit: test.onSubmit
		// 	};
		// 	outAction = [{
		// 		type: 'SUBMIT_NEW_MARKET'
		// 	}];
        //
		// 	assert.deepEqual(store.getActions(), outAction, `Didn't dispatch the expected action object when onSubmit was "clicked"`);
		// 	assert.deepEqual(test, out, `Didn't produce the expected object from select`);
        //
		// });
});
