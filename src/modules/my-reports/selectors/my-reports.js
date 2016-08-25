import { formatEther, formatPercent, formatRep } from '../../../utils/format-number';
import { formatDate } from '../../../utils/format-date';
import { loadMarketsInfo } from '../../markets/actions/load-markets-info';
import { BINARY, CATEGORICAL, SCALAR } from '../../markets/constants/market-types';
import store from '../../../store';
import memoizerific from 'memoizerific';

export default function () {
	const { eventsWithAccountReport } = store.getState();

	if (!eventsWithAccountReport) {
		return [];
	}

	const reports = Object.keys(eventsWithAccountReport).map(eventId => {
		const expirationDate = eventsWithAccountReport[eventId].expirationDate || null;
		const isFinal = eventsWithAccountReport[eventId].isFinal || null;

		const marketId = eventsWithAccountReport[eventId].marketID || null;
		const description = getMarketDescription(marketId);
		const outcome = selectMarketOutcome(eventsWithAccountReport[eventId].marketOutcome, marketId);
		const outcomePercentage = eventsWithAccountReport[eventId].proportionCorrect && formatPercent(eventsWithAccountReport[eventId].proportionCorrect) || null;
		const reported = selectMarketOutcome(eventsWithAccountReport[eventId].accountReport, marketId);
		const isReportEqual = outcome != null && reported != null && outcome === reported || null; // Can be done here
		const feesEarned = calculateFeesEarned(eventsWithAccountReport[eventId]);
		const repEarned = eventsWithAccountReport[eventId].repEarned && formatRep(eventsWithAccountReport[eventId].repEarned) || null;
		const endDate = expirationDate && formatDate(expirationDate) || null;
		const isChallenged = eventsWithAccountReport[eventId].isChallenged || null;
		const isChallengeable = isFinal != null && isChallenged != null && !isFinal && !isChallenged;

		return {
			eventId,
			marketId,
			description,
			outcome,
			outcomePercentage,
			reported,
			isReportEqual,
			feesEarned,
			repEarned,
			endDate,
			isChallenged,
			isChallengeable
		};
	});

	return reports;
}

export const getMarketDescription = memoizerific(1000)(marketID => {
	const { allMarkets } = require('../../../selectors');

	if (!allMarkets.filter(market => market.id === marketID)) {
		store.dispatch(loadMarketsInfo([marketID]));
		return null;
	}

	return allMarkets.filter(market => market.id === marketID)[0] && allMarkets.filter(market => market.id === marketID)[0].description || null;
});

export const calculateFeesEarned = (event) => {
	if (!event.marketFees || !event.repBalance || !event.eventWeight) return null;

	return formatEther(0.5 * event.marketFees * event.repBalance / event.eventWeight, { denomination: ' eth' });
};

export const selectMarketOutcome = memoizerific(1000)((outcomeID, marketID) => {
	if (!outcomeID || !marketID) return null;

	const { allMarkets } = require('../../../selectors');
	const filteredMarket = allMarkets.filter(market => market.id === marketID);

	if (!filteredMarket) return null;

	switch (filteredMarket.type) {
	case BINARY:
	case CATEGORICAL:
		return filteredMarket.outcome[outcomeID].name;
	case SCALAR:
		return filteredMarket.outcome[outcomeID].price;
	default:
		return null;
	}
});
