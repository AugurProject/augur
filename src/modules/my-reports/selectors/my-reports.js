import { formatEther, formatPercent } from '../../../utils/format-number';
import { formatDate } from '../../../utils/format-date';
import { loadMarketsInfo } from '../../markets/actions/load-markets-info';
import { abi } from '../../../services/augurjs';
import { TWO } from '../../trade/constants/numbers';
import { BINARY, CATEGORICAL, SCALAR } from '../../markets/constants/market-types';
import store from '../../../store';
import memoizerific from 'memoizerific';
import { selectMarketLink } from '../../link/selectors/links';

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
		const marketLink = marketId && description && selectMarketLink({ id: marketId, description }, store.dispatch) || null;
		const outcome = selectMarketOutcome(eventsWithAccountReport[eventId].marketOutcome, marketId);
		const outcomePercentage = eventsWithAccountReport[eventId].proportionCorrect && formatPercent(eventsWithAccountReport[eventId].proportionCorrect) || null;
		const reported = selectMarketOutcome(eventsWithAccountReport[eventId].accountReport, marketId);
		const isReportEqual = outcome != null && reported != null && outcome === reported || null; // Can be done here
		const feesEarned = calculateFeesEarned(eventsWithAccountReport[eventId]);
		// TODO why is repEarned set to an empty array??
		// const repEarned = eventsWithAccountReport[eventId].repEarned && formatRep(eventsWithAccountReport[eventId].repEarned) || null;
		const repEarned = null;
		const endDate = expirationDate && formatDate(expirationDate) || null;
		const isChallenged = eventsWithAccountReport[eventId].isChallenged || null;
		const isChallengeable = isFinal != null && isChallenged != null && !isFinal && !isChallenged;

		return {
			eventId,
			marketId,
			marketLink,
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
	return formatEther(
		abi.bignum(event.marketFees)
			.times(abi.bignum(event.repBalance))
			.dividedBy(TWO)
			.dividedBy(abi.bignum(event.eventWeight)),
		{ denomination: ' ETH' }
	);
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
