import { createSelector } from 'reselect';
import {
  selectAccountPositionsState,
} from 'appStore/select-state';
import { MyPositionsSummary } from 'modules/types';
import { formatDaiPrice, formatPercent, formatDai, formatEther } from 'utils/format-number';
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
        currentValue: formatEther(0),
        totalPercent: formatPercent(0),
        totalReturns: formatEther(0),
        valueChange: formatPercent(0),
        valueChange24Hr: formatPercent(0),
      };
    }
    const marketPositions = marketAccountPositions.tradingPositionsPerMarket;

    const currentValue = formatEther(marketPositions.currentValue || ZERO);
    const totalReturns = formatEther(marketPositions.total || ZERO);
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

    const valueChange24Hr = formatPercent(
      createBigNumber(
        marketPositions.unrealized24HrPercent || ZERO
      ).times(100),
      { decimalsRounded: 2 }
    );

    return {
      currentValue,
      totalPercent,
      totalReturns,
      valueChange,
      valueChange24Hr
    };
  }
);
