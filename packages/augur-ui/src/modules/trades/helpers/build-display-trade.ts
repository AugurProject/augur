import { createBigNumber } from "utils/create-big-number";
import { ZERO, BUY } from "modules/common/constants";

export const buildDisplayTrade = (trade) => {
  const {
    userNetPositions,
    outcomeId,
    numShares,
    side,
  } = trade;

  const outcomeIndex = parseInt(outcomeId, 10);
  const bnExistingShares = createBigNumber(userNetPositions[outcomeIndex]);
  const bnNumShares = createBigNumber(numShares);
  const addOutcomeShares =
    side === BUY
      ? bnNumShares.plus(bnExistingShares)
      : bnNumShares.minus(bnExistingShares);
  const useShares = addOutcomeShares.lte(bnNumShares);
  const cost = Math.min(
    bnNumShares.toNumber(),
    bnExistingShares.abs().toNumber(),
  );

  return {
    ...trade,
    shareCost: useShares ? cost : ZERO,
    totalCost: addOutcomeShares.lte(ZERO) ? ZERO : addOutcomeShares.toString(),
  };
};
