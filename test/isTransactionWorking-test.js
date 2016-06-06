import selectors from '../src/selectors';
import isTransactionsWorkingAssertion from './assertions/isTransactionsWorking';

describe(`selectors.isTransactionsWorking tests:`, () => {
	// isTransactionsWorking: Boolean,
	it(`should contain a isTransactionsWorking boolean`, () => {
		let actual = selectors.isTransactionsWorking;
		isTransactionsWorkingAssertion(actual);
	});
});
