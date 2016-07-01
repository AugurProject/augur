import selectors from '../src/selectors';
import * as assertions from './assertions';

describe('trade', () => {
	let actual = selectors;

	console.log('actual -- ', actual);



	// sideOptions
	assertions.trade.sideOptions(actual.sideOptions);

	// updateSelectedOutcome
	assertions.trade.updateSelectedOutcome(actual.selectedOutcome);

	// selectedOutcomeID
	assertions.trade.selectedOutcomeID(actual.selectedOutcome);

	// tradeOrders
	assertions.trade.tradeOrders(actual.markets[0].tradeSummary);

	// tradeSummary
	assertions.trade.tradeSummary(actual.markets[0]);

	// onSubmitPlaceTrade
	assertions.trade.onSubmitPlaceTrade(actual.markets[0]);
});