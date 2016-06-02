import selectors from '../src/selectors';
import * as assertions from './assertions/marketsTotals';

describe(`selectors.marketsTotals tests:`, () => {
  // marketsTotals:
  //  { positionsSummary:
  //     { numPositions: [Object],
  //       totalValue: [Object],
  //       gainPercent: [Object] },
  //    numPendingReports: 19 },
	it(`should contain a marketsTotal and is the expected shape`, () => {
		let actual = selectors.marketsTotals;
		assertions.marketsTotalsAssertion(actual);
	});

	it(`marketsTotal should contain a positionsSummary object with the correct shape`, () => {
		let actual = selectors.marketsTotals.positionsSummary;
		// console.log(actual);
		assertions.positionsSummaryAssertion(actual);
	});
});
