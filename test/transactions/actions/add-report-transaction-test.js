import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/transactions/actions/add-report-transaction.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, action, out;
	let state = Object.assign({}, testState);
	store = mockStore(state);
	let mockSubmit = {};
	let mockAdd = {
		addTransaction: () => {}
	};
	mockSubmit.sendCommitReport = sinon.stub().returns({
		type: 'PROCESS_REPORTS'
	});

	sinon.stub(mockAdd, `addTransaction`, (arg) => {
		return {
			type: 'ADD_TRANSACTION',
			data: arg
		}
	});

	action = proxyquire('../../../src/modules/transactions/actions/add-report-transaction.js', {
		'../../reports/actions/commit-report': mockSubmit,
		'../../transactions/actions/add-transactions': mockAdd
	});

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	it(`should add and make a report transaction`, () => {
		let market = {
			id: 'testMarket',
			reportableOutcomes: {
				test1: {
					id: 'test1'
				},
				test2: {
					id: 'test2'
				},
				find: () => [market.reportableOutcomes.test1, market.reportableOutcomes.test2]
			}
		};

		store.dispatch(action.addCommitReportTransaction(market, 'test1', false, false, 1, 5));

		out = [{
			type: 'ADD_TRANSACTION',
			data: {
				type: 'commit_report',
				gas: 1,
				ether: 5,
				data: {
					market,
					outcome: [{
						id: 'test1'
					}, {
						id: 'test2'
					}],
					reportedOutcomeID: 'test1',
					isUnethical: false,
					isIndeterminate: false
				},
				action: store.getActions()[0].data.action
			}
		}, {
			type: 'PROCESS_REPORTS'
		}];
		// make sure to trigger the action function to confirm stub is being added.
		store.getActions()[0].data.action();
		assert(mockSubmit.sendCommitReport.calledOnce, `sendCommitReport didn't fire once when triggered`);
		assert(mockAdd.addTransaction.calledOnce, `addTranscation wasn't called exactly one time as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't return the expected object`);
	});

});
