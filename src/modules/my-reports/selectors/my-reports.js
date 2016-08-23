import { augur } from '../../../services/augurjs';
import { formatPercent } from '../../../utils/format-number';
import { formatDate } from '../../../utils/format-date';
import { loadMarketsInfo } from '../../markets/actions/load-markets-info';
import store from '../../../store';
import memoizerific from 'memoizerific';

export default function () {
	const { eventsWithAccountReport } = store.getState();

	if(!eventsWithAccountReport){
		return [];
	}

	// Req'd object:
	/*
		[
			{
				eventId: <string>,
				marketId: <string>,
				description: <string>, // Req MarketID
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
	});

// Whether it's been challanged -- def getRoundTwo(event):
// Whether it's already been challanged -- def getFinal(event):
}

export const getMarketIDForEvent = memoizerific(100)(eventID => {
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

export const getMarketDescription = memoizerific(100)(marketID => {
	const { allMarkets } = require('../../../selectors');

	return allMarkets.filter(market => market.id === marketID)[0] && allMarkets.filter(market => market.id === marketID)[0].description || null;
});

