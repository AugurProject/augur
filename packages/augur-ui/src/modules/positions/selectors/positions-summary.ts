import memoize from 'memoizee';
import { createBigNumber } from 'utils/create-big-number';

import {
  CLOSED,
  LONG,
  SHORT,
  ZERO,
  BINARY_CATEGORICAL_FORMAT_OPTIONS,
  SCALAR,
} from 'modules/common/constants';
import { formatDai, formatPercent, formatShares } from 'utils/format-number';

export const positionSummary = memoize(
  (adjustedPosition, outcome, marketType) => {
    if (!adjustedPosition) {
      return null;
    }
    const opts =
      marketType === SCALAR ? {} : { ...BINARY_CATEGORICAL_FORMAT_OPTIONS };
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
      unrealizedRevenue24hChangePercent,
    } = adjustedPosition;

    const quantity = createBigNumber(netPosition).abs();
    let type = createBigNumber(netPosition).gte('0') ? LONG : SHORT;
    if (
      createBigNumber(quantity).isEqualTo(ZERO) &&
      createBigNumber(averagePrice).isEqualTo(ZERO)
    ) {
      type = CLOSED;
    }

    return {
      marketId,
      outcomeId,
      type,
      quantity: formatShares(quantity, opts),
      purchasePrice: formatDai(averagePrice),
      realizedNet: formatDai(realized),
      unrealizedNet: formatDai(unrealized),
      unrealized24Hr: formatDai(unrealized24),
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
      totalCost: formatDai(unrealizedCost),
      totalValue: formatDai(currentValue),
      lastPrice: formatDai(outcome.price),
      totalReturns: formatDai(total || ZERO),
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
