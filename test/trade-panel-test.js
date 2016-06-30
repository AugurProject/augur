import selectors from '../src/selectors';
import * as assertions from './assertions';

describe('trade panel', () => {
	let actual = selectors;

	// outcomes
	assertions.tradePanel.outcomes(actual);

	// sideOptions
	assertions.tradePanel.sideOptions(actual);

	// updateSelectedOutcome
	assertions.tradePanel.updateSelectedOutcome(actual);

	// selectedOutcomeID
	assertions.tradePanel.selectedOutcomeID(actual);

	// tradeOrders
	assertions.tradePanel.tradeOrders(actual);

	// tradeSummary
	assertions.tradePanel.tradeSummary(actual);

	// onSubmitPlaceTrade
	assertions.tradePanel.onSubmitPlaceTrade(actual);
});