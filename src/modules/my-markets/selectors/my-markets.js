import memoizerific from 'memoizerific';
import { abi } from '../../../services/augurjs';
import { ZERO } from '../../trade/constants/numbers';
import store from '../../../store';
import { formatNumber, formatEther } from '../../../utils/format-number';
import { selectMarketLink } from '../../link/selectors/links';

export default function () {
	const { allMarkets, loginAccount } = require('../../../selectors');

	if (!allMarkets || !loginAccount || !loginAccount.address) return [];

	const filteredMarkets = selectFilteredMarkets(allMarkets, loginAccount.address);
	const loginAccountMarkets = selectLoginAccountMarkets(filteredMarkets);

	return loginAccountMarkets;
}

export const selectMyMarket = (market) => {
	const { loginAccount } = require('../../../selectors');

	if (!market || !loginAccount || !loginAccount.address || !market.author || market.author !== loginAccount.address) return [];
	if (!market || !loginAccount || !loginAccount.address || !market.author || market.author !== loginAccount.address) return [];

	return selectLoginAccountMarkets([market]);
};

export const selectFilteredMarkets = memoizerific(1)((allMarkets, authorID) => allMarkets.filter(market => market.author === authorID));

export const selectLoginAccountMarkets = memoizerific(1)((authorOwnedMarkets) => {
	const { marketTrades, priceHistory, marketCreatorFees } = store.getState();

	const markets = [];

	authorOwnedMarkets.forEach((market) => {
		const fees = formatEther(marketCreatorFees[market.id] || 0);

		const numberOfTrades = formatNumber(selectNumberOfTrades(marketTrades[market.id]));
		const averageTradeSize = formatNumber(selectAverageTradeSize(priceHistory[market.id]));
		const openVolume = formatNumber(selectOpenVolume(market));
		const marketLink = selectMarketLink(market, store.dispatch);

		markets.push({
			id: market.id,
			description: market.description,
			endDate: market.endDate,
			volume: market.volume,
			marketLink,
			fees,
			numberOfTrades,
			averageTradeSize,
			openVolume
		});
	});

	return markets;
});

export const selectNumberOfTrades = memoizerific(1)((trades) => {
	if (!trades) {
		return 0;
	}

	return Object.keys(trades).reduce((p, outcome) => (p + trades[outcome].length), 0);
});

export const selectOpenVolume = (market) => {
	let openVolume = ZERO;

	market.outcomes.forEach((outcome) => {
		Object.keys(outcome.orderBook).forEach((orderType) => {
			outcome.orderBook[orderType].forEach((type) => {
				openVolume = openVolume.plus(abi.bignum(type.shares.value));
			});
		});
	});

	return openVolume;
};

export const selectAverageTradeSize = memoizerific(1)((marketPriceHistory) => {
	if (!marketPriceHistory) {
		return 0;
	}

	const initialState = {
		shares: ZERO,
		trades: 0
	};

	const priceHistoryTotals = Object.keys(marketPriceHistory).reduce((historyTotals, currentOutcome) => {
		const outcomeTotals = marketPriceHistory[currentOutcome].reduce((outcomeTotals, trade) => ({
			shares: abi.bignum(outcomeTotals.shares).plus(abi.bignum(trade.shares)),
			trades: outcomeTotals.trades + 1
		}), initialState);

		return {
			shares: historyTotals.shares.plus(outcomeTotals.shares),
			trades: historyTotals.trades + outcomeTotals.trades
		};
	}, initialState);

	return priceHistoryTotals.shares.dividedBy(abi.bignum(priceHistoryTotals.trades));
});
