import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';
import {
	BINARY,
	CATEGORICAL,
	SCALAR,
	COMBINATORIAL
} from '../../../src/modules/markets/constants/market-types';
import {
	PENDING,
	SUCCESS,
	FAILED,
	CREATING_MARKET
} from '../../../src/modules/transactions/constants/statuses';

describe(`modules/create-market/actions/submit-new-market.js`, () => {
	// proxyquire.noPreserveCache().noCallThru();
	// const middlewares = [thunk];
	// const mockStore = configureMockStore(middlewares);
	// let store, action, out, clock;
	// let state = Object.assign({}, testState);
	// store = mockStore(state);
	// let testData = {
	// 	type: 'UPDATE_TRANSACTIONS_DATA',
	// 	test123: {
	// 		type: 'create_market',
	// 		gas: 0,
	// 		ether: 0,
	// 		data: {
	// 			market: 'some marketdata'
	// 		},
	// 		action: 'do some action',
	// 		status: 'pending'
	// 	}
	// };
	// let fakeInclude = {
	// 	addCreateMarketTransaction: () => {}
	// };
    //
	// sinon.stub(fakeInclude, 'addCreateMarketTransaction', (newMarket) => testData);
    //
	// let fakeAugurJS = {};
	// fakeAugurJS.createMarket = sinon.stub().yields(null, {
	// 	marketID: 'test123',
	// 	status: SUCCESS,
	// });
	// fakeAugurJS.createMarket.onCall(1).yields({
	// 	message: 'error!'
	// }, {
	// 	status: FAILED
	// });
    //
	// // let fakeLoadMarket = {};
    //
	// let fakeGenerateOrderBook = {};
    //
	// action = proxyquire(
	// 	'../../../src/modules/create-market/actions/submit-new-market',
	// 	// {
	// 	// 	'./generate-order-book': fakeGenerateOrderBook,
	// 	// 	'../../transactions/actions/add-create-market-transaction': fakeInclude,
	// 	// 	'../../../services/augurjs': fakeAugurJS,
	// 	// 	'../../market/actions/load-market': fakeLoadMarket
	// 	// }
	// );
    //
	// fakeLoadMarket.loadMarket = sinon.stub().returns({
	// 	type: 'loadMarket'
	// });
    //
	// fakeGenerateOrderBook = sinon.stub().returns({
	// 	type: 'TEST'
	// });
    //
	// beforeEach(() => {
	// 	store.clearActions();
	// 	clock = sinon.useFakeTimers();
	// 	// Mock the window object
	// 	global.window = {};
	// 	global.window.performance = {
	// 		now: () => Date.now()
	// 	};
	// 	global.window.location = {
	// 		pathname: '/test',
	// 		search: 'example'
	// 	};
	// 	global.window.history = {
	// 		state: [],
	// 		pushState: (a, b, c) => window.history.state.push(c)
	// 	};
	// 	global.window.scrollTo = (x, y) => true;
	// });
    //
	// afterEach(() => {
	// 	global.window = {};
	// 	store.clearActions();
	// 	clock.restore();
	// });

	it(`should be able to submit a new market`, () => {

		// store.dispatch(action.submitNewMarket({
		// 	market: {
		// 		id: 'market'
		// 	}
		// }));
		// out = [{
		// 	type: 'SHOW_LINK',
		// 	parsedURL: {
		// 		pathArray: ['/transactions'],
		// 		searchParams: {},
		// 		url: '/transactions'
		// 	}
		// }, {
		// 	type: 'UPDATE_TRANSACTIONS_DATA',
		// 	'test123': {
		// 		type: 'create_market',
		// 		gas: 0,
		// 		ether: 0,
		// 		data: {
		// 			market: 'some marketdata'
		// 		},
		// 		action: 'do some action',
		// 		status: 'pending'
		// 	}
		// }];
        //
		// assert(fakeInclude.addCreateMarketTransaction.calledOnce, `addCreateMarketTransaction wasn't called once as expected`);
		// assert.deepEqual(store.getActions(), out, `Didn't correctly create a new market`);
	});

	it(`should be able to create a new market`, () => {
		// store.dispatch(action.createMarket('trans1234', {
		// 	type: BINARY
		// }));
		// clock.tick(20000);
        //
		// console.log('getActions -- ', store.getActions());
        //
		// assert.deepEqual(
		// 	store.getActions(),
		// 	[
		// 		{
		// 			type: 'CLEAR_MAKE_IN_PROGRESS'
		// 		},
		// 		{
		// 			type: 'generate_order_book'
		// 		},
		// 		{
		// 			type: 'loadMarket'
		// 		}
		// 	],
		// 	`Didn't dispatch the right actions for a successfully created binary market`
		// );
		// assert(fakeAugurJS.createMarket.calledOnce, `createMarket wasn't called one time after dispatching a createMarket action`);
		// assert(fakeLoadMarket.loadMarket.calledOnce, `loadMarket wasn't called once as expected`);
		// assert(fakeGenerateOrderBook.submitGenerateOrderBook.calledOnce, 'submitGenerateOrderBook wasn\'t called once as expected');
        //
		// store.clearActions();
        //
		// store.dispatch(action.createMarket('trans12345', {
		// 	type: BINARY
		// }));
        //
		// assert(fakeAugurJS.createMarket.calledTwice, `createMarket wasn't called twice after dispatching a createMarket Action 2 times`);
		// assert.deepEqual(store.getActions(), [], `Didn't properly dispatch actions for a error when creating account`);
	});

	it('[TODO] should be able to generate an order book');
});
