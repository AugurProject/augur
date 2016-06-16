import selectors from '../src/selectors';
import * as assertions from './assertions/market';

describe(`selectors.markets[0] (single market) tests:`, () => {
	// markets:
  //  [ { id: String,
  //      type: String,
  //      description: String,
  //      endDate: Object,
  //      tradingFeePercent: Object,
  //      volume: Object,
  //      isOpen: Boolean,
  //      isPendingReport: Boolean,
  //      marketLink: Object,
  //      tags: Object,
  //      outcomes: Object,
  //      reportableOutcomes: Object,
  //      tradeSummary: Function,
  //      priceTimeSeries: Object,
  //      positionsSummary: Object,
  //      report: Object },
 	// 				...
	// 	]
	it(`should contain a market with the expected shape`, () => {
		let actual = selectors.markets[0];
		// console.log(actual);
		assertions.marketAssertion(actual);
	});
});
