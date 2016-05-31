import selectors from '../src/selectors';
import transactionsTotalsAssertion from './assertions/transactionsTotals';

describe(`selectors.transactionsTotals tests:`, () => {
	// transactionsTotals: { title: String },
	it(`should contain a transactionsTotals object with the expected shape`, () => {
		let actual = selectors.transactionsTotals;
		transactionsTotalsAssertion(actual);
	});
});
