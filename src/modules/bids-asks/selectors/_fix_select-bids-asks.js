import memoizerific from 'memoizerific';
import { formatShares, formatEther } from '../../../utils/format-number';

import { BID, ASK } from '../../../modules/transactions/constants/types';

// import { selectOutcomes } from '../../markets/selectors/select-outcomes';
export const selectOutcomeBidsAsks = memoizerific(100)((outcomeBidsOrAsks, isSortDesc) => {
	const o = [];

	if (!outcomeBidsOrAsks) {
		return o;
	}

	const prices = Object.keys(outcomeBidsOrAsks);

	if (isSortDesc) {
		prices.sort((a, b) => b - a);
	} else {
		prices.sort();
	}

	prices.forEach(price => Object.keys(outcomeBidsOrAsks[price]).forEach(accountID => {
		o.push({
			accountID,
			price: parseFloat(price) || 0,
			numShares: outcomeBidsOrAsks[price][accountID]
		});
	}));

	return o;
});

export const selectOutcomeBids = (marketID, outcomeID, bidsAsks) =>
selectOutcomeBidsAsks(bidsAsks	&& bidsAsks[marketID]
	&& bidsAsks[marketID][outcomeID]
	&& bidsAsks[marketID][outcomeID][BID], true);

export const selectOutcomeAsks = (marketID, outcomeID, bidsAsks) =>
selectOutcomeBidsAsks(bidsAsks && bidsAsks[marketID] &&
bidsAsks[marketID][outcomeID] && bidsAsks[marketID][outcomeID][ASK]);

export const selectBidsAsksByPrice = (marketID, s, dispatch) => {
	const { bidsAsks } = s;
	const marketBidsAsks = bidsAsks && bidsAsks[marketID];
	let bidKeys;
	let askKeys;
	let o;
	const asks = [];

	if (!marketBidsAsks) {
		return asks;
	}

	const outcomes = selectOutcomes(marketID, s, dispatch);
	const aggregateShares = (priceCollection) =>
		Object.keys(priceCollection).reduce((numShares, accountID) =>
		numShares + parseFloat(priceCollection[accountID]), 0);

	if (!outcomes || !outcomes.length) {
		return asks;
	}

	outcomes.forEach(outcome => {
		o = {
			...outcome,
			outcomeID: outcome.id,
			bids: [],
			asks: []
		};

		bidKeys = Object.keys(marketBidsAsks[outcome.id] &&
		marketBidsAsks[outcome.id][BID] || {}).sort((a, b) => b - a);
		askKeys = Object.keys(marketBidsAsks[outcome.id] &&
		marketBidsAsks[outcome.id][ASK] || {}).sort();

		bidKeys.forEach(price => {
			o.bids.push({
				price: formatEther(price),
				shares: formatShares(aggregateShares(marketBidsAsks[outcome.id][BID][price]))
			});
		});

		askKeys.forEach(price => {
			o.asks.push({
				price: formatEther(price),
				shares: formatShares(aggregateShares(marketBidsAsks[outcome.id][ASK][price]))
			});
		});

		asks.push(o);
	});

	return asks;
};
