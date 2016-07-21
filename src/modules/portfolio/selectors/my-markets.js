import memoizerific from 'memoizerific';
import AugurJS from '../../../services/augurjs';
import { formatNumber, formatEther } from '../../../utils/format-number';

export default function () {
	const { allMarkets, loginAccount } = require('../../../selectors');

	const authorOwnedMarkets = selectAuthorOwnedMarkets(allMarkets, loginAccount.id);
	const myMarkets = selectMyMarkets(authorOwnedMarkets);

	return myMarkets;
}

export const selectAuthorOwnedMarkets = memoizerific(1)((allMarkets, authorID) => allMarkets.filter(market => market.author === authorID));

export const selectMyMarkets = memoizerific(1)(authorOwnedMarkets => {
	const authorMarkets = [];

	authorOwnedMarkets.forEach((market) => {
		const fees = formatEther(AugurJS.getFees(market.id));
		const volume = formatNumber(AugurJS.getVolume(market.id));
		const numberOfTrades = formatNumber(AugurJS.get_total_trades(market.id));

		authorMarkets.push({
			description: market.description,
			endDate: market.endDate,
			fees,
			volume,
			numberOfTrades
		});
	});

	return authorMarkets;
});
