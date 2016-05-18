import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import {
	PENDING,
	SUCCESS,
	FAILED,
	INTERRUPTED
} from '../../../src/modules/transactions/constants/statuses';
import testState from '../../testState';

describe(`modules/transactions/selectors/is-transaction-working.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	let out, test, selector, state, fakeStore;
	state = Object.assign({}, testState);

	fakeStore = {
		default: {
			getState: () => state
		}
	};

	selector = proxyquire('../../../src/modules/transactions/selectors/is-transactions-working', {
		'../../../store': fakeStore
	});

	it(`should check if a transaction is working`, () => {
		let data = state.transactionsData;
		test = selector.selectIsWorking(data);
		assert.isFalse(test, `Didn't mark the transaction as not working when status was ${FAILED}.`);

		data = {
			testtransaction12345: {
				id: 'testtransaction12345',
				status: SUCCESS
			}
		};
		test = selector.selectIsWorking(data);
		assert.isFalse(test, `Didn't mark the transaction as not working when status was ${SUCCESS}.`);

		data = {
			testtransaction12345: {
				id: 'testtransaction12345',
				status: PENDING
			}
		};
		test = selector.selectIsWorking(data);
		assert.isFalse(test, `Didn't mark the transaction as not working when status was ${PENDING}.`);

		data = {
			testtransaction12345: {
				id: 'testtransaction12345',
				status: INTERRUPTED
			}
		};
		test = selector.selectIsWorking(data);
		assert.isFalse(test, `Didn't mark the transaction as not working when status was ${INTERRUPTED}.`);

		data = {
			testtransaction12345: {
				id: 'testtransaction12345',
				status: 'test'
			}
		};
		test = selector.selectIsWorking(data);
		assert.isTrue(test, `Didn't mark the transaction as working when status was test.`);
	});

});
