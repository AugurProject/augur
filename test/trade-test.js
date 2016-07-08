import selectors from '../src/selectors';
import { sideOptions, updateSelectedOutcome, selectedOutcomeID, onSubmitPlaceTrade } from './assertions/trade';

describe('trade', () => {
	let actual = selectors;

	// sideOptions
	sideOptions(actual.sideOptions);

	// updateSelectedOutcome
	updateSelectedOutcome(actual.selectedOutcome);

	// selectedOutcomeID
	selectedOutcomeID(actual.selectedOutcome);

	// onSubmitPlaceTrade
	onSubmitPlaceTrade(actual.markets[0]);
});