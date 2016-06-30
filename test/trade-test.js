import selectors from '../src/selectors';
import * as assertions from './assertions';

describe('trade', () => {
	let actual = selectors;

	// outcomes
	assertions.trade.outcomes(actual);

	// sideOptions
	assertions.trade.sideOptions(actual);

	// updateSelectedOutcome
	assertions.trade.updateSelectedOutcome(actual);

	// selectedOutcomeID
	assertions.trade.selectedOutcomeID(actual);

	// tradeOrders
	assertions.trade.tradeOrders(actual);

	// tradeSummary
	assertions.trade.tradeSummary(actual);

	// onSubmitPlaceTrade
	assertions.trade.onSubmitPlaceTrade(actual);
});