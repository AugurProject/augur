import memoize from 'memoizee';
import { createBigNumber } from 'utils/create-big-number';

import {
  CLOSED,
  LONG,
  SHORT,
  ZERO,
  REPORTING_STATE,
  CLOSED_LONG,
  CLOSED_SHORT,
} from 'modules/common/constants';
import { formatEther, formatPercent, formatShares, formatNone, formatMarketShares } from 'utils/format-number';

export const positionSummary = memoize(
  (adjustedPosition, outcome, marketType, reportingState, isFullLoss) => {
    if (!adjustedPosition) {
      return null;
    }

    const {
      netPosition,
      realized,
      realizedPercent,
      unrealized,
      unrealized24,
      unrealizedPercent,
      unrealized24HrPercent,
      averagePrice,
      marketId,
      outcome: outcomeId,
      total,
      totalPercent,
      currentValue,
      unrealizedCost,
      realizedCost,
      unrealizedRevenue24hChangePercent,
      priorPosition,
    } = adjustedPosition;

    let quantity = createBigNumber(netPosition).abs();
    let type = createBigNumber(netPosition).gte('0') ? LONG : SHORT;
    let avgPrice = averagePrice;
    let showRealizedCost =
      reportingState === REPORTING_STATE.FINALIZED && type !== CLOSED;
    let totalCost = showRealizedCost ? realizedCost : unrealizedCost
    if (createBigNumber(quantity).isEqualTo(ZERO)) {
      type = CLOSED;
      if (priorPosition) {
        type = createBigNumber(priorPosition.netPosition).gte(0) ? CLOSED_LONG : CLOSED_SHORT;
        quantity = createBigNumber(priorPosition.netPosition).abs();
        avgPrice = priorPosition.avgPrice;
        totalCost = priorPosition.unrealizedCost;
      }
    } else {
      // user has full loss on market positions and the market is finalized
      if (isFullLoss) {
        type = createBigNumber(netPosition).gte(0) ? CLOSED_LONG : CLOSED_SHORT;
      }
    }
    return {
      marketId,
      outcomeId,
      type,
      quantity: formatMarketShares(marketType, quantity),
      purchasePrice: formatEther(avgPrice, { decimals: 3, decimalsRounded: 3 }),
      realizedNet: formatEther(realized),
      unrealizedNet: formatEther(unrealized),
      unrealized24Hr: formatEther(unrealized24),
      realizedPercent: formatPercent(timesHundred(realizedPercent || ZERO), {
        decimalsRounded: 2,
      }),
      unrealizedPercent: formatPercent(
        timesHundred(unrealizedPercent || ZERO),
        { decimalsRounded: 2 }
      ),
      unrealized24HrPercent: formatPercent(
        timesHundred(unrealized24HrPercent || ZERO),
        { decimalsRounded: 2 }
      ),
      totalCost: formatEther(totalCost),
      totalValue: formatEther(currentValue),
      lastPrice: !!outcome.price ? formatEther(outcome.price) : formatNone(),
      totalReturns: formatEther(total || ZERO),
      valueChange: formatPercent(
        timesHundred(unrealizedRevenue24hChangePercent),
        {
          decimalsRounded: 2,
        }
      ),
      totalPercent: formatPercent(timesHundred(totalPercent || ZERO), {
        decimalsRounded: 2,
      }),
    };
  },
  {
    max: 50,
  }
);

const timesHundred = value =>
  isNaN(value) ? createBigNumber('0') : createBigNumber(value).times(100);
