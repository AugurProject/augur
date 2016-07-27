import memoizerific from 'memoizerific';
import AugurJS from '../../../services/augurjs';
import store from '../../../store';
import { formatNumber, formatEther } from '../../../utils/format-number';

export default function () {
	const { allMarkets, loginAccount } = require('../../../selectors');

	const filteredMarkets = selectFilteredMarkets(allMarkets, loginAccount.id);
	const loginAccountMarkets = selectLoginAccountMarkets(filteredMarkets);

	return loginAccountMarkets;
}

export const selectFilteredMarkets = memoizerific(1)((allMarkets, authorID) => allMarkets.filter(market => market.author === authorID));

export const selectLoginAccountMarkets = memoizerific(1)(authorOwnedMarkets => {
	const { marketTrades } = store.getState();

	const markets = [];

	authorOwnedMarkets.forEach((market) => {
		console.log('market.id -- ', market.id);

		const fees = formatEther(AugurJS.getFees(market.id));

		const numberOfTrades = formatNumber(selectNumberOfTrades(marketTrades[market.id]));
		const averageTradeSize = formatNumber(selectAverageTradeSize(market.marketPriceHistory));
		const openVolume = formatNumber(selectOpenVolume(market));

		markets.push({
			description: market.description,
			endDate: market.endDate,
			volume: market.volume,
			fees,
			numberOfTrades,
			averageTradeSize,
			openVolume
		});
	});

	return markets;
});

export const selectNumberOfTrades = trades => {
	if (!trades) {
		return 0;
	}

	let totalTrades = 0;

	Object.key(trades).forEach(outcome => {
		totalTrades += trades[outcome].length;
	});

	return totalTrades;
};

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

export const selectAverageTradeSize = marketPriceHistory => {
	if (marketPriceHistory == null) {
		return 0;
	}

	const initialState = {
		shares: 0,
		trades: 0
	};

	const priceHistoryTotals = Object.keys(marketPriceHistory).reduce((historyTotals, currentOutcome) => {
		const outcomeTotals = marketPriceHistory[currentOutcome].reduce((outcomeTotals, trade) => ({
			shares: outcomeTotals.shares + Number(trade.shares),
			trades: outcomeTotals.trades + 1
		}), initialState);

		return {
			shares: historyTotals.shares + outcomeTotals.shares,
			trades: historyTotals.trades + outcomeTotals.trades
		};
	}, initialState);

	return priceHistoryTotals.shares / priceHistoryTotals.trades;
};
