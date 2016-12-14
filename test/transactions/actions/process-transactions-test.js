import { describe, it } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from 'test/testState';

describe(`modules/transactions/actions/process-transactions.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	const state = Object.assign({}, testState);
	const store = mockStore(state);
	const trans = {
		transactions: [{
			id: 'test1',
			action: sinon.stub(),
			status: 'pending'
		}, {
			id: 'test2',
			action: sinon.stub(),
			status: 'pending'
		}, {
			id: 'test3',
			action: sinon.stub(),
			status: 'pending'
		}]
	};

	const action = proxyquire('../../../src/modules/transactions/actions/process-transactions', {
		'../../../selectors': trans
	});

	it(`should process pending transactions`, () => {
		store.dispatch(action.processTransactions());

		assert(trans.transactions[0].action.calledOnce, `mockTrans1 wasn't called once`);
		assert(trans.transactions[1].action.calledOnce, `MockTrans2 wasn't called once`);
		assert(trans.transactions[2].action.calledOnce, `MockTrans3 wasn't called once`);
	});
});
