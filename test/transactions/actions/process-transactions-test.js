import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/transactions/actions/process-transactions.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, action;
	let state = Object.assign({}, testState);
	store = mockStore(state);
	let trans = {
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

	action = proxyquire('../../../src/modules/transactions/actions/process-transactions', {
		'../../../selectors': trans
	});

	it(`should process pending transactions`, () => {
		store.dispatch(action.processTransactions());
	});
});
