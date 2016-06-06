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

	// tradingFeePercent: {
	// 	value: Number,
	//   formattedValue: Number,
	//   formatted: String,
	//   roundedValue: Number,
	//   rounded: String,
	//   minimized: String,
	//   denomination: String,
	//   full: String
	// }
	// it(`market should contain a tradingFeePercent object with correct shape`, () => {
	// 	let actual = selectors.markets[0].tradingFeePercent;
	// 	assertions.tradingFeePercentAssertion(actual);
	// });

	// volume: {
	// 	value: Number,
	//   formattedValue: Number,
	//   formatted: String,
	//   roundedValue: Number,
	//   rounded: String,
	//   minimized: String,
	//   denomination: String,
	//   full: String
	// }
	// it(`market should contain a volume object with correct shape`, () => {
	// 	let actual = selectors.markets[0].volume;
	// 	assertions.volumeAssertion(actual);
	// });

	// report: {
	// 	isUnethical: Boolean,
  // 	onSubmitReport: [Function: onSubmitReport]
	// }
	// it(`market should contain a report object with correct shape`, () => {
	// 	let actual = selectors.markets[0].report;
	// 	assertions.reportAssertion(actual);
	// });

	// marketLink: {
	// 	text: string,
	//   className: string,
	//   onClick: [Function: onClick]
	// }
	// it(`market should contain a marketLink with expected shape`, () => {
	// 	let actual = selectors.markets[0].marketLink;
	// 	assertions.marketLinkAssertion(actual);
	// });
});
