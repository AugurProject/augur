import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';
import assertions from 'augur-ui-react-components/lib/assertions';

describe(`modules/transactions/selectors/transactions.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, selector, expected, actual;
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
	store = mockStore(state);

	selector = proxyquire('../../../src/modules/transactions/selectors/transactions', {
		'../../../store': store
	});


	it(`should return data on all transactions`, () => {
		actual = selector.default();
		assertions.transactions(actual);
	});

});
