import memoize from "memoizee";
import { createBigNumber } from "utils/create-big-number";

import { CLOSED, LONG, SHORT, ZERO } from "modules/common/constants";
import { formatDai, formatPercent, formatShares } from "utils/format-number";

export const positionSummary = memoize(
  (adjustedPosition, outcome) => {
    if (!adjustedPosition) {
      return null;
    }
    const {
      netPosition,
      realized,
      realizedPercent,
      unrealized,
      unrealizedPercent,
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
    let type = createBigNumber(netPosition).gte("0") ? LONG : SHORT;
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
      quantity: formatShares(quantity),
      purchasePrice: formatDai(averagePrice),
      realizedNet: formatDai(realized),
      unrealizedNet: formatDai(unrealized),
      realizedPercent: formatPercent(timesHundred(realizedPercent || ZERO), {
        decimalsRounded: 2,
      }),
      unrealizedPercent: formatPercent(
        timesHundred(unrealizedPercent || ZERO),
        { decimalsRounded: 2 },
      ),
      totalCost: formatDai(unrealizedCost),
      totalValue: formatDai(currentValue),
      lastPrice: formatDai(outcome.price),
      totalReturns: formatDai(total || ZERO),
      valueChange: formatPercent(
        timesHundred(unrealizedRevenue24hChangePercent),
        {
          decimalsRounded: 2,
        },
      ),
      totalPercent: formatPercent(timesHundred(totalPercent || ZERO), {
        decimalsRounded: 2,
      }),
    };
  },
  {
    max: 50,
  },
);

const timesHundred = (value) => isNaN(value) ? createBigNumber("0") : createBigNumber(value).times(100);
