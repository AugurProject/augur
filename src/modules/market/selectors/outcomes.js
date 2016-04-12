import memoizerific from 'memoizerific';
import { formatPercent } from '../../../utils/format-number';

import store from '../../../store';

export default function() {
	var { selectedMarketID, outcomes } = store.getState();
	return selectOutcomes(selectedMarketID, outcomes[selectedMarketID]);
}

export const selectOutcomes = memoizerific(1000)(function(marketID, marketOutcomes) {
    if (!marketOutcomes) {
        return [];
    }
    return Object.keys(marketOutcomes)
            .map(outcomeID => selectOutcome(marketID, outcomeID, marketOutcomes[outcomeID]))
            .sort((a, b) => (b.price - a.price) || (a.id < b.id ? -1 : 1));
});

export const selectOutcome = memoizerific(1000)(function(marketID, outcomeID, outcome) {
    return {
        ...outcome,
        id: outcomeID,
        marketID,
        pricePercent: formatPercent(outcome.price * 100)
    };
});