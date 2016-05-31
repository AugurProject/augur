import selectors from '../src/selectors';
import isTransactionWorkingAssertion from './assertions/isTransactionWorking';

describe(`selectors.isTransactionsWorking tests:`, () => {
	// isTransactionsWorking: Boolean,
	it(`should contain a isTransactionsWorking boolean`, () => {
		let actual = selectors.isTransactionsWorking;
		isTransactionWorkingAssertion(actual);
	});
});
