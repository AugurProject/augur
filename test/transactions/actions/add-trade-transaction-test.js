import {
	assert
} from 'chai';
import { BUY, SELL } from '../../../src/modules/trade/constants/types';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/transactions/actions/add-trade-transaction.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	const store = mockStore(testState);
	const fakeAddTransactions = { addTransaction: () => {} };
	const fakeProcessBuy = { processBuy: () => {} };
	const fakeProcessSell = { processSell: () => {} };

	sinon.stub(fakeAddTransactions, 'addTransaction', (data) => {
		return { type: 'ADD_TRANSACTION', ...data };
	});

	sinon.stub(fakeProcessBuy, 'processBuy', (data) => {
		return { type: 'BUY', ...data };
	});

	sinon.stub(fakeProcessSell, 'processSell', (data) => {
		return { type: 'SELL', ...data };
	});

	const action = proxyquire('../../../src/modules/transactions/actions/add-trade-transaction.js', {
		'../../transactions/actions/add-transactions': fakeAddTransactions,
		'../../trade/actions/process-sell': fakeProcessSell,
		'../../trade/actions/process-buy': fakeProcessBuy
	});

	beforeEach(() => {
		store.clearActions()
	});

	it(`should add a Buy Trade Transaction`, () => {
		store.dispatch(action.addTradeTransaction(BUY, 'marketID', 'outcomeID', 'marketType', 'Some Market Description', 'anOutcomeName', 5, 10, 50, 3, 2, 1));
		const actual = store.getActions();
		actual[0].action();

		const expected = [{
			type: 'buy',
			data: {
				marketID: 'marketID',
				outcomeID: 'outcomeID',
				marketType: 'marketType',
				marketDescription: 'Some Market Description',
				outcomeName: 'anOutcomeName',
			},
			numShares: {
				value: 5,
				formattedValue: 5,
				formatted: '5',
				roundedValue: 5,
				rounded: '5.00',
				minimized: '5',
				denomination: ' shares',
				full: '5 shares'
			},
			avgPrice: {
				value: 10,
				formattedValue: 10,
				formatted: '10.0000',
				roundedValue: 10,
				rounded: '10.0000',
				minimized: '10',
				denomination: ' ETH',
				full: '10.0000 ETH'
			},
			tradingFees: {
				denomination: ' ETH',
				formatted: '3.0000',
				formattedValue: 3,
				full: '3.0000 ETH',
				minimized: '3',
				rounded: '3.0000',
				roundedValue: 3,
				value: 3
			},
			feePercent: {
				denomination: '%',
				formatted: '2.0',
				formattedValue: 2,
				full: '2.0%',
				minimized: '2',
				rounded: '2',
				roundedValue: 2,
				value: 2
			},
			noFeePrice: {
				value: 10,
				formattedValue: 10,
				formatted: '10.0000',
				roundedValue: 10,
				rounded: '10.0000',
				minimized: '10',
				denomination: ' ETH',
				full: '10.0000 ETH'
			},
			gasFees: {
				denomination: ' real ETH',
				formatted: '1.0000',
				formattedValue: 1,
				full: '1.0000 real ETH',
				minimized: '1',
				rounded: '1.0000',
				roundedValue: 1,
				value: 1,
			},
			action: actual[0].action
		}, {
			type: 'BUY'
		}];

		assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`);

		assert(fakeProcessBuy.processBuy.calledOnce, `processBuy wasn't called once as expected`);
	});

	it(`should add a Sell Trade Transaction`, () => {
		store.dispatch(action.addTradeTransaction(SELL, 'marketID', 'outcomeID', 'marketType', 'Some Market Description', 'anOutcomeName', 5, 10, 50, 3, 2, 1));
		const actual = store.getActions();
		actual[0].action();

		const expected = [{
			type: 'sell',
			data: {
				marketID: 'marketID',
				outcomeID: 'outcomeID',
				marketType: 'marketType',
				marketDescription: 'Some Market Description',
				outcomeName: 'anOutcomeName',
			},
			numShares: {
				value: 5,
				formattedValue: 5,
				formatted: '5',
				roundedValue: 5,
				rounded: '5.00',
				minimized: '5',
				denomination: ' shares',
				full: '5 shares'
			},
			avgPrice: {
				value: 10,
				formattedValue: 10,
				formatted: '10.0000',
				roundedValue: 10,
				rounded: '10.0000',
				minimized: '10',
				denomination: ' ETH',
				full: '10.0000 ETH'
			},
			noFeePrice: {
				value: 10,
				formattedValue: 10,
				formatted: '10.0000',
				roundedValue: 10,
				rounded: '10.0000',
				minimized: '10',
				denomination: ' ETH',
				full: '10.0000 ETH'
			},
			tradingFees: {
				denomination: ' ETH',
				formatted: '3.0000',
				formattedValue: 3,
				full: '3.0000 ETH',
				minimized: '3',
				rounded: '3.0000',
				roundedValue: 3,
				value: 3
			},
			feePercent: {
				denomination: '%',
				formatted: '2.0',
				formattedValue: 2,
				full: '2.0%',
				minimized: '2',
				rounded: '2',
				roundedValue: 2,
				value: 2
			},
			gasFees: {
				denomination: ' real ETH',
				formatted: '1.0000',
				formattedValue: 1,
				full: '1.0000 real ETH',
				minimized: '1',
				rounded: '1.0000',
				roundedValue: 1,
				value: 1,
			},
			action: actual[0].action
		}, {
			type: 'SELL'
		}];

		assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`);

		assert(fakeProcessSell.processSell.calledOnce, `processSell wasn't called once as expected`);
	});
});
