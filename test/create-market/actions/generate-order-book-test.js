import {
    assert
} from 'chai';

import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

import { GENERATE_ORDER_BOOK } from '../../../src/modules/transactions/constants/types';

import {
    SUCCESS,
    FAILED,
    GENERATING_ORDER_BOOK,
    COMPLETE_SET_BOUGHT,
    ORDER_BOOK_ORDER_COMPLETE,
    ORDER_BOOK_OUTCOME_COMPLETE
} from '../../../src/modules/transactions/constants/statuses';

describe('modules/create-market/actions/generate-order-book.js', () => {
    proxyquire.noPreserveCache().noCallThru();

    const   middlewares = [thunk],
            mockStore = configureMockStore(middlewares);

    let store,
        action,
        out,
        orderBookTransactions,
        stubbedTransactions,
        stubbedAugurJS,
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

    orderBookTransactions = {
        addGenerateOrderBookTransaction: () => {}
    };

    stubbedTransactions = sinon.stub(Object.assign({}, orderBookTransactions));
    stubbedTransactions.addGenerateOrderBookTransaction.withArgs(marketData).returns({
        type: GENERATE_ORDER_BOOK,
        data: marketData,
        action: 'create order book action'
    });

    let stubbedUpdateTransaction = {
        updateExistingTransaction: () => {}
    };

    sinon.stub(stubbedUpdateTransaction, 'updateExistingTransaction', (transactionID, status) => {
        return {
            type: 'UPDATE_EXISTING_TRANSACTIONS',
            transactionID,
            status
        };
    });

    stubbedAugurJS = {
        generateOrderBook: () => {}
    };
    sinon.stub(stubbedAugurJS, 'generateOrderBook');

    action = proxyquire(
        '../../../src/modules/create-market/actions/generate-order-book',
        {
            '../../../services/augurjs': stubbedAugurJS,
            '../../transactions/actions/add-generate-order-book-transaction': stubbedTransactions,
            '../../transactions/actions/update-existing-transaction': stubbedUpdateTransaction
        }
    );

    beforeEach(() => {
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
    	global.window = {};
    	store.clearActions();
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

    it('should be able to generate an order book', () => {
        store.dispatch(action.createOrderBook('trans123', marketData));

        assert(stubbedAugurJS.generateOrderBook.calledOnce, `generateOrderBook wasn't called once as expected`);
        assert.deepEqual(store.getActions(), [{
            type: 'UPDATE_EXISTING_TRANSACTIONS',
            transactionID: 'trans123',
            status: {
                status: GENERATING_ORDER_BOOK
            }
        }], `Didn't correctly create order book`);
    });

    describe('generateOrderBook callbacks', () => {
        beforeEach(() => {
            store.clearActions();
        });

        it('should handle onFailed', () => {
            store.dispatch(
                action.handleGenerateOrderBookResponse(
                    {
                        message: 'failed'
                    },
                    null,
                    'trans123'
                )
            );

            assert.deepEqual(store.getActions(), [{
                type: 'UPDATE_EXISTING_TRANSACTIONS',
                transactionID: 'trans123',
                status: {
                    status: FAILED,
                    message: 'failed'
                }
            }], `Didn't correctly handle onFailed callback`);
        });

        it('should handle onSuccess', () => {
            store.dispatch(
                action.handleGenerateOrderBookResponse(
                    null,
                    {
                        status: SUCCESS
                    },
                    'trans123'
                )
            );

            assert.deepEqual(store.getActions(), [{
                type: 'UPDATE_EXISTING_TRANSACTIONS',
                transactionID: 'trans123',
                status: {
                    status: SUCCESS,
                    message: null
                }
            }], `Didn't correctly handle onSuccess callback`);
        });

        it('should handle onBuyCompleteSets', () => {
            store.dispatch(
                action.handleGenerateOrderBookResponse(
                    null,
                    {
                        status: COMPLETE_SET_BOUGHT
                    },
                    'trans123'
                )
            );

            assert.deepEqual(store.getActions(), [{
                type: 'UPDATE_EXISTING_TRANSACTIONS',
                transactionID: 'trans123',
                status: {
                    status: COMPLETE_SET_BOUGHT,
                    message: null
                }
            }], `Didn't correctly handle onCompleteSets callback`);
        });
    });
});