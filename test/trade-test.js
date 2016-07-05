import selectors from '../src/selectors';
import * as assertions from './assertions';

describe('trade', () => {
	let actual = selectors;

	// sideOptions
	assertions.trade.sideOptions(actual.sideOptions);

	// updateSelectedOutcome
	assertions.trade.updateSelectedOutcome(actual.selectedOutcome);

	// selectedOutcomeID
	assertions.trade.selectedOutcomeID(actual.selectedOutcome);

	// onSubmitPlaceTrade
	assertions.trade.onSubmitPlaceTrade(actual.markets[0]);
});