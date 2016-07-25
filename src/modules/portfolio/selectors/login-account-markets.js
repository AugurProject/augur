import memoizerific from 'memoizerific';
import AugurJS from '../../../services/augurjs';
import { formatNumber, formatEther } from '../../../utils/format-number';
import { loadFullMarket } from '../../market/actions/load-full-market';

export default function () {
	const { allMarkets, loginAccount } = require('../../../selectors');

	const filteredMarkets = selectFilteredMarkets(allMarkets, loginAccount.id);
	const loginAccountMarkets = selectLoginAccountMarkets(filteredMarkets);

	return loginAccountMarkets;
}

export const selectFilteredMarkets = memoizerific(1)((allMarkets, authorID) => allMarkets.filter(market => market.author === authorID));

export const selectLoginAccountMarkets = memoizerific(1)(authorOwnedMarkets => {
	const markets = [];

	authorOwnedMarkets.forEach((market) => {
		// store.dispatch(loadFullMarket(market.id));

		const fees = formatEther(AugurJS.getFees(market.id));
		const volume = formatNumber(AugurJS.getVolume(market.id));
		const numberOfTrades = formatNumber(AugurJS.get_total_trades(market.id));

		const averageTradeSize = formatEther(0);
		const openVolume = formatNumber(selectOpenVolume(market));

		// selectAverageTradeSize(market);

		markets.push({
			description: market.description,
			endDate: market.endDate,
			fees,
			volume,
			numberOfTrades,
			averageTradeSize,
			openVolume
		});
	});

	return markets;
});

export const selectOpenVolume = market => {
	let openVolume = 0;

	market.outcomes.forEach(outcome => {
		Object.keys(outcome.orderBook).forEach(orderType => {
			outcome.orderBook[orderType].forEach(type => {
				openVolume += type.shares.value;
			});
		});
	});

	return openVolume;
};

export const selectAverageTradeSize = market => {
	// const { marketOrderBooks } = store.getState();

	console.log('MARKET -- ', market);
	// console.log('marketOrderBook -- ', marketOrderBooks);
};
