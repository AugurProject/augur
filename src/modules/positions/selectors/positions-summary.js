import memoize from "memoizee";
import { createBigNumber } from "utils/create-big-number";

import { ZERO } from "modules/trades/constants/numbers";
import { LONG, SHORT } from "modules/positions/constants/position-types";

import { formatEther, formatShares, formatNumber } from "utils/format-number";

export const generateOutcomePositionSummary = memoize(
  adjustedPosition => {
    if (!adjustedPosition) {
      return null;
    }
    const {
      netPosition,
      position,
      realized,
      unrealized,
      averagePrice,
      marketId,
      outcome: outcomeId
    } = adjustedPosition;
    return {
      marketId,
      outcomeId,
      ...generatePositionsSummary(
        1,
        netPosition,
        position,
        averagePrice,
        realized,
        unrealized
      )
    };
  },
  {
    max: 50
  }
);

export const generateMarketsPositionsSummary = memoize(
  markets => {
    if (!markets || !markets.length) {
      return null;
    }
    let position = ZERO;
    let totalRealizedNet = ZERO;
    let totalUnrealizedNet = ZERO;
    let netPosition = ZERO;
    let totalNet = ZERO;
    let purchasePrice = ZERO;
    const positionOutcomes = [];
    markets.forEach(market => {
      market.outcomes.forEach(outcome => {
        if (
          !outcome ||
          !outcome.position ||
          !outcome.position.numPositions ||
          !outcome.position.numPositions.value
        ) {
          return;
        }
        netPosition = netPosition.plus(
          createBigNumber(outcome.position.netPosition.value, 10)
        );
        position = position.plus(
          createBigNumber(outcome.position.position.value, 10)
        );
        purchasePrice = purchasePrice.plus(
          createBigNumber(outcome.position.purchasePrice.value, 10)
        );
        totalRealizedNet = totalRealizedNet.plus(
          createBigNumber(outcome.position.realizedNet.value, 10)
        );
        totalUnrealizedNet = totalUnrealizedNet.plus(
          createBigNumber(outcome.position.unrealizedNet.value, 10)
        );
        totalNet = totalNet.plus(
          createBigNumber(outcome.position.totalNet.value, 10)
        );
        positionOutcomes.push(outcome);
      });
    });
    const positionsSummary = generatePositionsSummary(
      positionOutcomes.length,
      netPosition,
      position,
      purchasePrice,
      totalRealizedNet,
      totalUnrealizedNet,
      totalNet
    );
    return {
      ...positionsSummary,
      positionOutcomes
    };
  },
  {
    max: 50
  }
);

export const generatePositionsSummary = memoize(
  (
    numPositions,
    netPosition,
    position,
    meanTradePrice,
    realizedNet,
    unrealizedNet,
    totalNet
  ) => ({
    numPositions: formatNumber(numPositions, {
      decimals: 0,
      decimalsRounded: 0,
      denomination: "Positions",
      positiveSign: false,
      zeroStyled: false
    }),
    type: createBigNumber(netPosition).gt("0") ? LONG : SHORT,
    netPosition: formatShares(netPosition),
    position: formatShares(position),
    purchasePrice: formatEther(meanTradePrice),
    realizedNet: formatEther(realizedNet),
    unrealizedNet: formatEther(unrealizedNet),
    totalNet: formatEther(totalNet)
  }),
  {
    max: 20
  }
);
