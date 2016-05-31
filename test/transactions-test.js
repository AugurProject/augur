import selectors from '../src/selectors';
import transactionsAssertion from './assertions/transactions';

describe(`selectors.transactions tests:`, () => {
	// transactions: Array,
	it(`should contain a transactions with the expected shape`, () => {
		let actual = selectors.transactions;
		transactionsAssertion(actual);
	});
});
