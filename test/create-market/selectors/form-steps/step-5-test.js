import {
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

	// 	it('should return the correct object for a binary market', () => {
	// 		formState = {
	// 			...formState,
	// 			type: BINARY,
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
	// 		};
    //
	// 		out = {
	// 			endDate: {
	// 				value: new Date(3000, 0, 1, 0, 0, 0, 0),
	// 				formatted: 'Jan 1, 3000',
	// 				full: new Date(3000, 0, 1, 0, 0, 0, 0).toISOString()
	// 			},
	// 			tradingFeePercent: {
	// 				value: 2,
	// 				formattedValue: 2,
	// 				formatted: '+2.0',
	// 				roundedValue: 2,
	// 				rounded: '+2',
	// 				minimized: '+2',
	// 				denomination: '%',
	// 				full: '+2.0%'
	// 			},
	// 			makerFee: 0.005,
	// 			expirySource: 'testing',
	// 			type: 'binary',
	// 			initialFairPrices: {
	// 				type: 'binary',
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
	// 				raw: [ 0.5, 0.5 ],
	// 				formatted: [
	// 					{
	// 						value: 0.5,
	// 						formattedValue: 0.5,
	// 						formatted: '0.5',
	// 						roundedValue: 1,
	// 						rounded: '1',
	// 						minimized: '0.5',
	// 						denomination: 'ETH | Yes',
	// 						full: '0.5ETH | Yes'
	// 					},
	// 					{
	// 						value: 0.5,
	// 						formattedValue: 0.5,
	// 						formatted: '0.5',
	// 						roundedValue: 1,
	// 						rounded: '1',
	// 						minimized: '0.5',
	// 						denomination: 'ETH | No',
	// 						full: '0.5ETH | No'
	// 					}
	// 				]
	// 			},
	// 			endBlock: 2587661218,
	// 			tradingFee: 0.02,
	// 			makerFeePercent:
	// 			{ value: 0.5,
	// 				formattedValue: 0.5,
	// 				formatted: '+0.5',
	// 				roundedValue: 1,
	// 				rounded: '+1',
	// 				minimized: '+0.5',
	// 				denomination: '%',
	// 				full: '+0.5%'
	// 			},
	// 			takerFeePercent: {
	// 				value: 99.5,
	// 				formattedValue: 99.5,
	// 				formatted: '+99.5',
	// 				roundedValue: 100,
	// 				rounded: '+100',
	// 				minimized: '+99.5',
	// 				denomination: '%',
	// 				full: '+99.5%'
	// 			},
	// 			volume: {
	// 				value: 0,
	// 				formattedValue: 0,
	// 				formatted: '-',
	// 				roundedValue: 0,
	// 				rounded: '-',
	// 				minimized: '-',
	// 				denomination: '',
	// 				full: '-'
	// 			},
	// 			outcomes: [
	// 				{ id: 1, name: 'No' },
	// 				{ id: 2, name: 'Yes' }
	// 			],
	// 			isFavorite: false,
	// 			bestStartingQuantityFormatted: {
	// 				value: 0,
	// 				formattedValue: 0,
	// 				formatted: '-',
	// 				roundedValue: 0,
	// 				rounded: '-',
	// 				minimized: '-',
	// 				denomination: '',
	// 				full: '-'
	// 			},
	// 			startingQuantityFormatted: {
	// 				value: 0,
	// 				formattedValue: 0,
	// 				formatted: '-',
	// 				roundedValue: 0,
	// 				rounded: '-',
	// 				minimized: '-',
	// 				denomination: '',
	// 				full: '-'
	// 			},
	// 			priceWidthFormatted: {
	// 				value: 0,
	// 				formattedValue: 0,
	// 				formatted: '-',
	// 				roundedValue: 0,
	// 				rounded: '-',
	// 				minimized: '-',
	// 				denomination: '',
	// 				full: '-'
	// 			},
	// 			onSubmit: store.dispatch(stubbedSubmitNewMarket())
	// 		};
    //
	// 		// console.log('out -- ', out);
    //
	// 		selector.select(
	// 			formState,
	// 			state.blockchain.currentBlockNumber,
	// 			state.blockchain.currentBlockMillisSinceEpoch,
	// 			store.dispatch
	// 		);
    //
	// 		// 	assert.deepEqual(test, out, `Didn't produce the expected object from select`);
	//
	// 	});
	// 	it('should return the correct object for a categorical market');
	// 	it('should return the correct object for a scalar market');
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
