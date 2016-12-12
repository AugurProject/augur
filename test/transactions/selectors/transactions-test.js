import { describe, it } from 'mocha';
import proxyquire from 'proxyquire';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';
import transactionsAssertions from 'assertions/transactions';

describe(`modules/transactions/selectors/transactions.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let state = Object.assign({}, testState, {
		transactionsData: {
			testtransaction12345: {
				id: 'testtransaction12345',
				message: 'test message',
				status: 'failed',
				type: 'register',
				gas: 40,
				repChange: 100,
				sharesChange: 10,
				etherWithoutGas: 150,
				data: {
					id: '0x123'
				}
			}
		}
	});
	const store = mockStore(state);

	const selector = proxyquire('../../../src/modules/transactions/selectors/transactions', {
		'../../../store': store
	});


	it(`should return data on all transactions`, () => {
		const actual = selector.default();
		transactionsAssertions(actual);
	});
});
