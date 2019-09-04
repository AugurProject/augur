import { createSelector } from 'reselect';
import {
  selectAccountPositionsState,
} from 'store/select-state';
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
      return null;
    }
    const marketPositions = marketAccountPositions.tradingPositionsPerMarket;

    const currentValue = formatDai(marketPositions.unrealized || ZERO);
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
