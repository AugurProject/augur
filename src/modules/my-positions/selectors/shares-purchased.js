import memoizerific from 'memoizerific';
import store from '../../../store';

export default function () {
	return selectSharesPurchased(store.getState().outcomesData);
}

const sharesPurchasedCache = {};

export const selectSharesPurchased = memoizerific(1)(outcomesData => {
	let marketID;
	const marketIDs = Object.keys(outcomesData);
	const numMarkets = marketIDs.length;
	const sharesPurchased = new Array(numMarkets);
	for (let i = 0; i < numMarkets; ++i) {
		marketID = marketIDs[i];
		if (!sharesPurchasedCache[marketID]) {
			sharesPurchased[i] = selectMarketSharesPurchased(marketID, outcomesData[marketID]);
		} else {
			sharesPurchased[i] = sharesPurchasedCache[marketID](marketID, outcomesData[marketID]);
		}
	}
	return sharesPurchased;
});

export const selectMarketSharesPurchased = memoizerific(1)((marketID, marketOutcomeData) => {
	const outcomeIDs = Object.keys(marketOutcomeData);
	const numOutcomes = outcomeIDs.length;
	const marketSharesPurchased = new Array(numOutcomes);
	for (let j = 0; j < numOutcomes; ++j) {
		marketSharesPurchased[j] = selectOutcomeSharesPurchased(outcomeIDs[j], marketOutcomeData[outcomeIDs[j]]);
	}
	return { id: marketID, outcomes: marketSharesPurchased };
});

export const selectOutcomeSharesPurchased = memoizerific(8)((outcomeID, outcomeData) => ({
	id: outcomeID,
	shares: outcomeData.sharesPurchased
}));
