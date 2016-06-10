import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';
import { assertions } from 'augur-ui-react-components';

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
				etherWithoutGas: 150
			}
		}
	});
	store = mockStore(state);

	selector = proxyquire('../../../src/modules/transactions/selectors/transactions', {
		'../../../store': store
	});


	it(`should return data on all transactions`, () => {
		actual = selector.default();

		expected = [{
			id: 'testtransaction12345',
			message: 'test message',
			status: 'failed',
			type: 'register',
			gas: {
				value: 40,
				formattedValue: 40,
				formatted: '+40.00',
				roundedValue: 40,
				rounded: '+40.0',
				minimized: '+40',
				denomination: 'Eth',
				full: '+40.00Eth'
			},
			repChange: 100,
			sharesChange: 10,
			etherWithoutGas: 150,
			ether: {
				value: 150,
				formattedValue: 150,
				formatted: '+150.00',
				roundedValue: 150,
				rounded: '+150.0',
				minimized: '+150',
				denomination: 'Eth',
				full: '+150.00Eth'
			},
			shares: {
				value: 10,
				formattedValue: 10,
				formatted: '10',
				roundedValue: 10,
				rounded: '10',
				minimized: '10',
				denomination: 'Shares',
				full: '10Shares'
			},
			rep: {
				value: 100,
				formattedValue: 100,
				formatted: '+100',
				roundedValue: 100,
				rounded: '+100',
				minimized: '+100',
				denomination: 'Rep',
				full: '+100Rep'
			}
		}];
		assertions.transactions(actual);
		assert.deepEqual(actual, expected, `Didn't return the correct information`);
	});

});
