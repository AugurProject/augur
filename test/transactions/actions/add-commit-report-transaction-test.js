import { describe, it, beforeEach } from 'mocha';
import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from 'test/testState';

describe(`modules/transactions/actions/add-commit-report-transaction.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let out;
	const state = Object.assign({}, testState);
	const store = mockStore(state);
	const mockSubmit = {};
	const mockAdd = {
		addTransaction: () => {}
	};
	mockSubmit.sendCommitReport = sinon.stub().returns({
		type: 'PROCESS_REPORTS'
	});

	sinon.stub(mockAdd, `addTransaction`, arg => ({
		type: 'ADD_TRANSACTION',
		data: arg
	}));

	const action = proxyquire('../../../src/modules/transactions/actions/add-commit-report-transaction.js', {
		'../../reports/actions/commit-report': mockSubmit,
		'../../transactions/actions/add-transactions': mockAdd
	});

	beforeEach(() => {
		store.clearActions();
	});

	it(`should add and make a report transaction`, () => {
		const market = {
			id: 'testMarket',
			reportableOutcomes: {
				test1: {
					id: 'test1'
				},
				test2: {
					id: 'test2'
				},
				find: () => [market.reportableOutcomes.test1, market.reportableOutcomes.test2]
			},
			description: 'the best market ever'
		};

		store.dispatch(action.addCommitReportTransaction(market, 'test1', false, false, 1, 5));

		out = [{
			type: 'ADD_TRANSACTION',
			data: {
				type: 'commit_report',
				gas: 1,
				ether: 5,
				description: 'the best market ever',
				data: {
					market,
					marketID: 'testMarket',
					outcome: [{
						id: 'test1'
					}, {
						id: 'test2'
					}],
					reportedOutcomeID: 'test1',
					isUnethical: false,
					isIndeterminate: false
				},
				gasFees: {
					denomination: ' real ETH (estimated)',
					formatted: '0.0627',
					formattedValue: 0.0627,
					full: '0.0627 real ETH (estimated)',
					minimized: '0.0627',
					rounded: '0.0627',
					roundedValue: 0.0627,
					value: 0.0627
				},
				action: store.getActions()[0].data.action
			}
		}, {
			type: 'PROCESS_REPORTS'
		}];
		// make sure to trigger the action function to confirm stub is being added.
		store.getActions()[0].data.action();
		assert(mockSubmit.sendCommitReport.calledOnce, `sendCommitReport didn't fire once when triggered`);
		assert(mockAdd.addTransaction.calledOnce, `addTransaction wasn't called exactly one time as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't return the expected object`);
	});

});
