import selectors from '../src/selectors';
import positionsSummaryAssertion from './assertions/positions-summary';

describe(`selectors.positionsSummary tests:`, () => {
	it(`should contain a positionsSummary and is the expected shape`, () => {
		let actual = selectors.positionsSummary;
		positionsSummaryAssertion(actual);
	});
});
