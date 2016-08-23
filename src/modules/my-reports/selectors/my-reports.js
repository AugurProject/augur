import { augur } from '../../../services/augurjs';
import { formatNumber, formatPercent } from '../../../utils/format-number';
import { formatDate } from '../../../utils/format-date';
import { loadMarketsInfo } from '../../markets/actions/load-markets-info';
import { dateToBlock } from '../../../utils/date-to-block-to-date';
import { BINARY, CATEGORICAL, SCALAR } from '../../markets/constants/market-types';
import store from '../../../store';
import memoizerific from 'memoizerific';

export default function () {
	const { eventsWithAccountReport, loginAccount, blockchain } = store.getState();

	if (!eventsWithAccountReport) {
		return [];
	}

	const reports = Object.keys(eventsWithAccountReport.events).map(eventId => {
		const expirationDate = getEventExpiration(eventId);
		const isFinal = getFinal(eventId);

		const marketId = getMarketIDForEvent(eventId);
		const description = getMarketDescription(marketId);
		const outcome = getMarketOutcome(eventId, marketId);
		const outcomePercentage = getOutcomePercentage(eventId);
		const reported = getAccountReportOnEvent(eventId, eventsWithAccountReport[eventId], loginAccount.id, marketId);
		const isReportEqual = outcome === reported;
		const feesEarned = getFeesEarned(marketId, loginAccount.id, eventId, event[eventId]);
		const repEarned = getNetRep(eventId, loginAccount.id, blockchain.currentBlockNumber, expirationDate);
		const endDate = formatDate(expirationDate);
		const isChallenged = getRoundTwo(eventId);
		const isChallengeable = !isFinal && !isChallenged;

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

export const getMarketIDForEvent = memoizerific(1000)(eventID => {
	const { allMarkets } = require('../../../selectors');

	// Simply getting the first market since events -> markets are 1-to-1 currently
	augur.getMarket(eventID, 0, (res) => {
		if (!!res) {
			if (!allMarkets.filter(market => res === market.id)) store.dispatch(loadMarketsInfo([res]));
			return res;
		}
		return null;
	});
});

export const getMarketDescription = memoizerific(1000)(marketID => {
	const { allMarkets } = require('../../../selectors');

	return allMarkets.filter(market => market.id === marketID)[0] && allMarkets.filter(market => market.id === marketID)[0].description || null;
});

export const getMarketOutcome = memoizerific(1000)((eventID, marketID) => {
	augur.getOutcome(eventID, (res) => {
		if (!!res) return selectMarketOutcome(res, marketID);

		return null;
	});
});

export const getOutcomePercentage = memoizerific(1000)(eventID => {
	augur.proportionCorrect(eventID, res => !!res && formatPercent(res) || null);
});

export const getAccountReportOnEvent = memoizerific(1000)((eventID, event, accountID, marketID) => {
	augur.getReport(event.branch, event.period, eventID, accountID, (res) => {
		if (!!res) return selectMarketOutcome(res, marketID);

		return null;
	});
});

export const getFeesEarned = memoizerific(1000)((marketID, accountID, eventID, event) => {
	const marketFees = getFees(marketID);
	const repBalance = getRepBalance(accountID);
	const eventWeight = getEventWeight(eventID, event);

	return 0.5 * marketFees * repBalance / eventWeight;
});

export const getNetRep = memoizerific(1000)((eventID, accountID, currentBlock, expirationDate) => {
	const expirationBlock = dateToBlock(expirationDate, currentBlock);

	augur.rpc.getLogs({
		fromBlock: expirationBlock,
		address: augur.contracts.Consensus,
		topics: [augur.format_int256(accountID)]
	}, res => !!res && formatNumber(res) || null);
});

export const getRoundTwo = eventID => {
	augur.getRoundTwo(eventID, res => !!res);
};

export const getFinal = eventID => {
	augur.getFinal(eventID, res => !!res);
};

export const getFees = marketID => {
	augur.getFees(marketID, res => !!res && res || null);
};

export const getRepBalance = accountID => {
	augur.getRepBalance(accountID, res => !!res && res || null);
};

export const getEventWeight = (eventID, event) => {
	augur.getEventWeight(event.branch, event.period, eventID, res => !!res && res || null);
};

export const getEventExpiration = memoizerific(1000)(eventID => {
	augur.getExpiration(eventID, res => !!res && res || null);
});

export const selectMarketOutcome = memoizerific(1000)((outcome, marketID) => {
	const { allMarkets } = require('../../../selectors');

	const filteredMarket = allMarkets.filter(market => market.id === marketID);

	if (!filteredMarket) return null;

	switch (filteredMarket.type) {
	case BINARY:
	case CATEGORICAL:
		return filteredMarket.outcome[outcome].name;
	case SCALAR:
		return filteredMarket.outcome[outcome].price;
	default:
		return null;
	}
});
