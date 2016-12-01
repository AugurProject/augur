import { describe, it } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import { PENDING, SUCCESS, FAILED, INTERRUPTED } from '../../../src/modules/transactions/constants/statuses';
import * as mockStore from '../../mockStore';
// import assertions from 'augur-ui-react-components/lib/assertions';

describe(`modules/transactions/selectors/is-transaction-working.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	let actual;

	const { state, store } = mockStore.default;
	const selector = proxyquire('../../../src/modules/transactions/selectors/is-transactions-working', {
		'../../../store': store
	});

	it(`should check if a transaction is working`, () => {
		let data = state.transactionsData;
		actual = selector.selectIsWorking(data);

		assert.isFalse(actual, `Didn't mark the transaction as not working when status was ${FAILED}.`);

		data = {
			testtransaction12345: {
				id: 'testtransaction12345',
				status: SUCCESS
			}
		};
		actual = selector.selectIsWorking(data);
		assert.isFalse(actual, `Didn't mark the transaction as not working when status was ${SUCCESS}.`);

		data = {
			testtransaction12345: {
				id: 'testtransaction12345',
				status: PENDING
			}
		};
		actual = selector.selectIsWorking(data);
		assert.isFalse(actual, `Didn't mark the transaction as not working when status was ${PENDING}.`);

		data = {
			testtransaction12345: {
				id: 'testtransaction12345',
				status: INTERRUPTED
			}
		};
		actual = selector.selectIsWorking(data);
		assert.isFalse(actual, `Didn't mark the transaction as not working when status was ${INTERRUPTED}.`);

		data = {
			testtransaction12345: {
				id: 'testtransaction12345',
				status: 'test'
			}
		};
		actual = selector.selectIsWorking(data);

		// assertions.isTransactionsWorking(actual);
		assert.isTrue(actual, `Didn't mark the transaction as working when status was test.`);
	});

});
