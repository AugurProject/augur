import { augur } from '../../../services/augurjs';
import { formatPercent } from '../../../utils/format-number';
import { formatDate } from '../../../utils/format-date';
import { loadMarketsInfo } from '../../markets/actions/load-markets-info';
import { BINARY, CATEGORICAL, SCALAR } from '../../markets/constants/market-types';
import store from '../../../store';
import memoizerific from 'memoizerific';

export default function () {
	const { eventsWithAccountReport, loginAccount } = store.getState();

	if(!eventsWithAccountReport){
		return [];
	}

	return [];

	// Req'd object:
	/*
		[
			{
				eventId: <string>,
				marketId: <string>,
				description: <string>,
				outcome: <string>,
				outcomePercentage: <formattedNumber>,
				reported: <string>,
				isReportEqual: <bool>,
				feesEarned: <formattedNumber>, // Req MarketID
				repEarned: <formattedNumber>,
				endDate: <formattedDate>,
				isChallenged: <bool>, // TODO
				isChallengeable: <bool> // TODO
			}
		]
	 */

	const reports = Object.keys(eventsWithAccountReport).map(eventID => {
		const marketID = getMarketIDForEvent(eventID);
		const description = getMarketDescription(marketID);
		const outcome = getMarketOutcome(eventID, marketID);
		const outcomePercentage = getOutcomePercentage(eventID);
		const reported = getAccountReportOnEvent(eventID, eventsWithAccountReport[eventID], loginAccount.id, marketID);
	});

// Whether it's been challanged -- def getRoundTwo(event):
// Whether it's already been challanged -- def getFinal(event):
}

export const getMarketIDForEvent = memoizerific(1000)(eventID => {
	const { allMarkets } = require('../../../selectors');

	// Simply getting the first market since events -> markets are 1-to-1 currently
	augur.getMarket(eventID, 0, (res) => {
		console.log('getMarket res -- ', res);
		if (!!res) {
			if(!allMarkets.filter(market => res === market.id)) store.dispatch(loadMarketsInfo([res]));
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
		if(!!res) return selectMarketOutcome(res, marketID);

		return null;
	});
});

export const getOutcomePercentage = memoizerific(1000)(eventID => {
	augur.proportionCorrect(eventID, (res) => {
		return !!res ? formatPercent(res) : null;
	});
});

export const getAccountReportOnEvent = memoizerific(1000)((eventID, event, accountID, marketID) => {
	augur.getReport(event.branch, event.period, eventID, accountID, (res) => {
		if(!!res) return selectMarketOutcome(res, marketID);

		return null;
	});
});

export const selectMarketOutcome = memoizerific(1000)((outcome, marketID) => {
	const { allMarkets } = require('../../../selectors');

	const filteredMarket = allMarkets.filter(market => market.id === marketID);

	if(!filteredMarket) return null;

	switch(filteredMarket.type){
	case BINARY:
	case CATEGORICAL:
		return filteredMarket.outcome[outcome].name;
	case SCALAR:
		return filteredMarket.outcome[outcome].price;
	default:
		return null;
	}
});
