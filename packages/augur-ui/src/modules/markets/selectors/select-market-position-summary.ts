import { createSelector } from 'reselect';
import {
  selectAccountPositionsState,
} from 'appStore/select-state';
import { MyPositionsSummary } from 'modules/types';
import { formatDai, formatPercent } from 'utils/format-number';
import { ZERO } from 'modules/common/constants';
import { createBigNumber } from 'utils/create-big-number';

function selectMarketUserPositions(state, marketId) {
  return selectAccountPositionsState(state)[marketId];
}

export const selectMarketPositionsSummary = createSelector(
  selectMarketUserPositions,
  (marketAccountPositions): MyPositionsSummary => {
    if (
      !marketAccountPositions ||
      !marketAccountPositions.tradingPositionsPerMarket
    ) {
      return {
        currentValue: formatDai(0),
        totalPercent: formatPercent(0),
        totalReturns: formatDai(0),
        valueChange: formatPercent(0),
      };
    }
    const marketPositions = marketAccountPositions.tradingPositionsPerMarket;

    const currentValue = formatDai(marketPositions.currentValue || ZERO);
    const totalReturns = formatDai(marketPositions.total || ZERO);
    const totalPercent = formatPercent(
      createBigNumber(marketPositions.totalPercent || ZERO).times(100),
      { decimalsRounded: 2 }
    );
    const valueChange = formatPercent(
      createBigNumber(
        marketPositions.unrealizedPercent || ZERO
      ).times(100),
      { decimalsRounded: 2 }
    );

    return {
      currentValue,
      totalPercent,
      totalReturns,
      valueChange,
    };
  }
);
