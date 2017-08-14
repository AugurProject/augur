import { createSelector } from 'reselect';
import memoize from 'memoizee';
import store from 'src/store';
import { selectLoginAccountAddress, selectMarketTradesState, selectPriceHistoryState, selectMarketCreatorFeesState } from 'src/select-state';
import selectAllMarkets from 'modules/markets/selectors/markets-all';
import { abi } from 'services/augurjs';
import { ZERO } from 'modules/trade/constants/numbers';
import { formatNumber, formatEtherTokens } from 'utils/format-number';
import { selectMarketLink } from 'modules/link/selectors/links';

export default function () {
  return selectLoginAccountMarkets(store.getState());
}

export const selectAuthorOwnedMarkets = createSelector(
  selectAllMarkets,
  selectLoginAccountAddress,
  (allMarkets, authorID) => {
    if (!allMarkets || !authorID) return null;
    return allMarkets.filter(market => market.author === authorID);
  }
);

export const selectLoginAccountMarkets = createSelector(
  selectAuthorOwnedMarkets,
  selectMarketTradesState,
  selectPriceHistoryState,
  selectMarketCreatorFeesState,
  (authorOwnedMarkets, marketTrades, priceHistory, marketCreatorFees) => {
    if (!authorOwnedMarkets) return [];
    const markets = [];
    authorOwnedMarkets.forEach((market) => {
      const fees = formatEtherTokens(marketCreatorFees[market.id] || 0);
      const numberOfTrades = formatNumber(selectNumberOfTrades(marketTrades[market.id]));
      const averageTradeSize = formatNumber(selectAverageTradeSize(priceHistory[market.id]));
      const openVolume = formatNumber(selectOpenVolume(market));
      const marketLink = selectMarketLink(market, store.dispatch);
      markets.push({
        ...market, // TODO -- cleanup this object
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
  }
);

export const selectNumberOfTrades = memoize((trades) => {
  if (!trades) return 0;
  return Object.keys(trades).reduce((p, outcome) => (p + trades[outcome].length), 0);
}, { max: 1 });

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

export const selectAverageTradeSize = memoize((marketPriceHistory) => {
  if (!marketPriceHistory) return 0;
  const initialState = {
    shares: ZERO,
    trades: 0
  };
  const priceHistoryTotals = Object.keys(marketPriceHistory).reduce((historyTotals, currentOutcome) => {
    const outcomeTotals = marketPriceHistory[currentOutcome].reduce((outcomeTotals, trade) => ({
      shares: abi.bignum(outcomeTotals.shares).plus(abi.bignum(trade.amount)),
      trades: outcomeTotals.trades + 1
    }), initialState);
    return {
      shares: historyTotals.shares.plus(outcomeTotals.shares),
      trades: historyTotals.trades + outcomeTotals.trades
    };
  }, initialState);
  return priceHistoryTotals.shares.dividedBy(abi.bignum(priceHistoryTotals.trades));
}, { max: 1 });
