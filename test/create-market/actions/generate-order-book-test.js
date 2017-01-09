import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert } from 'chai';
import BigNumber from 'bignumber.js';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from 'test/testState';

describe('modules/create-market/actions/generate-order-book.js', () => {

	proxyquire.noPreserveCache().noCallThru();

	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	const state = Object.assign({}, testState);

	const store = mockStore(state);

	const marketData = {
		id: 'test-market-id',
		liquidity: 50,
		initialFairPrices: [
			'0.5',
			'0.5'
		],
		startingQuantity: 10,
		bestStartingQuantity: 20,
		isSimulation: false
	};

	const stubbedAugurJS = {
		augur: { generateOrderBook: () => {} },
		abi: { bignum: () => {} }
	};
	sinon.stub(stubbedAugurJS.augur, 'generateOrderBook');
	sinon.stub(stubbedAugurJS.abi, 'bignum', n => new BigNumber(n, 10));

	const action = proxyquire(
	'../../../src/modules/create-market/actions/generate-order-book',
		{
			'../../../services/augurjs': stubbedAugurJS
		}
	);

	let clock;
	beforeEach(() => {
		clock = sinon.useFakeTimers();
		store.clearActions();

		global.window = {};
		global.window.performance = {
			now: () => Date.now()
		};
		global.window.location = {
			pathname: '/test',
			search: 'example'
		};
		global.window.history = {
			state: [],
			pushState: (a, b, c) => window.history.state.push(c)
		};
		global.window.scrollTo = (x, y) => true;
	});

	afterEach(() => {
		clock.restore();
		global.window = {};
		store.clearActions();
	});

	it('should be able to submit a request to generate an order book', () => {
		store.dispatch(action.submitGenerateOrderBook(marketData));
		const out = [{
			type: 'UPDATE_SELL_COMPLETE_SETS_LOCK',
			marketID: 'test-market-id',
			isLocked: true
		}];
		assert.deepEqual(store.getActions(), out, `Didn't correctly submit an order book`);
	});

	it('should be able to generate an order book', () => {
		store.dispatch(action.submitGenerateOrderBook(marketData));
		assert.deepEqual(store.getActions(), [{
			type: 'UPDATE_SELL_COMPLETE_SETS_LOCK',
			isLocked: true,
			marketID: marketData.id
		}], `Didn't correctly create order book`);
	});

});
