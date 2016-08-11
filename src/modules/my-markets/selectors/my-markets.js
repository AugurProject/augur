import memoizerific from 'memoizerific';
import { augur } from '../../../services/augurjs';
import store from '../../../store';
import { formatNumber, formatEther } from '../../../utils/format-number';

export default function () {
	const { allMarkets, loginAccount } = require('../../../selectors');

	if (!allMarkets || !loginAccount || !loginAccount.id) return [];

	const filteredMarkets = selectFilteredMarkets(allMarkets, loginAccount.id);
	const loginAccountMarkets = selectLoginAccountMarkets(filteredMarkets);

	return loginAccountMarkets;
}

export const selectMyMarket = market => {
	const { loginAccount } = require('../../../selectors');

	if (!market || !loginAccount || !loginAccount.id || !market.author || market.author !== loginAccount.id) return [];

	return selectLoginAccountMarkets([market]);
};

export const selectFilteredMarkets = memoizerific(1)((allMarkets, authorID) => allMarkets.filter(market => market.author === authorID));

export const selectLoginAccountMarkets = memoizerific(1)(authorOwnedMarkets => {
	const { marketTrades, priceHistory } = store.getState();

	const markets = [];

	authorOwnedMarkets.forEach((market) => {
		// TODO augur.getFees should be async (provide callback)
		const fees = formatEther(augur.getFees(market.id));

		const numberOfTrades = formatNumber(selectNumberOfTrades(marketTrades[market.id]));
		const averageTradeSize = formatNumber(selectAverageTradeSize(priceHistory[market.id]));
		const openVolume = formatNumber(selectOpenVolume(market));

		markets.push({
			id: market.id,
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

export const selectNumberOfTrades = memoizerific(1)(trades => {
	if (!trades) {
		return 0;
	}

	return Object.keys(trades).reduce((p, outcome) => (p + trades[outcome].length), 0);
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

export const selectAverageTradeSize = memoizerific(1)(marketPriceHistory => {
	if (!marketPriceHistory) {
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
});
