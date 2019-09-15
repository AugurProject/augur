import { createBigNumber } from './create-big-number';
import { ZERO } from 'modules/common/constants';

export function canClaimProceeds(state, id): boolean {
  if (
    state.accountPositions[id] &&
    state.accountPositions[id].tradingPositionsPerMarket &&
    createBigNumber(
      state.accountPositions[id].tradingPositionsPerMarket.totalUnclaimedProceeds
    ).gt(ZERO)
  ) {
    return true;
  }
  return false;
}
