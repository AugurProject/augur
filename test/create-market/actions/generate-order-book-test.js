import {
    assert
} from 'chai';

import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

import { GENERATE_ORDER_BOOK } from '../../../src/modules/transactions/constants/types';

describe('modules/create-market/actions/generate-order-book.js', () => {
    proxyquire.noPreserveCache().noCallThru();

    const   middlewares = [thunk],
            mockStore = configureMockStore(middlewares);

    let store,
        action,
        out,
        transactions,
        stubbedTransactions,
        marketData,
        state = Object.assign({}, testState);

    store = mockStore(state);

    marketData = {
        market: 'test-market-id',
        liquidity: 50,
        initialFairPrices: [
            '0.5',
            '0.5'
        ],
        startingQuantity: 10,
        bestStartingQuantity: 20,
        isSimulation: false
    };

    transactions = {
        addGenerateOrderBookTransaction: () => {}
    };

    stubbedTransactions = sinon.stub(Object.assign({}, transactions));

    stubbedTransactions.addGenerateOrderBookTransaction.withArgs(marketData).returns({
        type: GENERATE_ORDER_BOOK,
        data: marketData,
        action: 'create order book action'
    });

    action = proxyquire(
        '../../../src/modules/create-market/actions/generate-order-book',
        {
            '../../transactions/actions/add-generate-order-book-transaction': stubbedTransactions
        }
    );

    beforeEach(() => {
    	store.clearActions();
    	// clock = sinon.useFakeTimers();
    	// Mock the window object
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
    	global.window = {};
    	store.clearActions();
    	// clock.restore();
    });

    it('should be able to submit a request to generate an order book', () => {
        store.dispatch(action.submitGenerateOrderBook(marketData));

        out = [{
            type: GENERATE_ORDER_BOOK,
            data: marketData,
            action: 'create order book action'
        }];

        assert(stubbedTransactions.addGenerateOrderBookTransaction.calledOnce, `addGenerateOrderOrderBookTransaction wasn't called once as expected`);
        assert.deepEqual(store.getActions(), out, `Didn't correctly submit an order book`);
    });

    it('[TODO] should be able to generate an order book');
});