import { BigNumber } from 'bignumber.js';
import { ContractAPI } from '..';
import { MarketInfo } from '@augurproject/sdk/build/state/getter/Markets';
import { calculatePayoutNumeratorsArray } from '@augurproject/sdk';
import { MarketTypeName } from '@augurproject/sdk/build/state/logs/types';

export async function dispute(user: ContractAPI, market: MarketInfo, slow: boolean): Promise<void> {
  const SOME_REP = new BigNumber(1e18).times(6e7);

  const payoutNumerators = getPayoutNumerators(market, 'invalid');
  const conflictOutcome = market.marketType === MarketTypeName.Scalar ? makeValidScalarOutcome(market) : 1;
  const conflictNumerators = getPayoutNumerators(market, conflictOutcome);

  const marketContract = user.augur.contracts.marketFromAddress(market.id);

  await user.repFaucet(SOME_REP);

  // Get past the market time, into when we can accept the initial report.
  await user.setTimestamp(new BigNumber(market.endTime + 1));

  // Do the initial report, creating the first dispute window.
  const extraStake = slow ? SOME_REP.toString() : '0';
  await user.doInitialReport(marketContract, payoutNumerators, '', extraStake);

  // Contribution (dispute) fulfills the first dispute bond,
  // pushing into next dispute round that takes additional stake into account.
  await user.contribute(marketContract, conflictNumerators, SOME_REP);

  // With pre-filled stake in initial report, pacing requires just one more dispute to enter slow mode.
  if (slow) {
    await user.contribute(marketContract, conflictNumerators, SOME_REP);
  }
}

export function getPayoutNumerators(market: MarketInfo, outcome: number|'invalid'): BigNumber[] {
  const isInvalid = outcome === 'invalid';

  return calculatePayoutNumeratorsArray(
    market.maxPrice,
    market.minPrice,
    market.numTicks,
    market.numOutcomes,
    market.marketType,
    isInvalid ? -1 : outcome as number,
    isInvalid
  );
}

export function makeValidScalarOutcome(market: MarketInfo): number {
  return Math.floor(new BigNumber(market.maxPrice)
    .minus(market.minPrice)
    .dividedBy(3)
    .plus(market.minPrice).toNumber());
}
