import { BigNumber } from 'bignumber.js';
import { ContractAPI } from '..';
import { MarketInfo } from '@augurproject/sdk/build/state/getter/Markets';
import { calculatePayoutNumeratorsArray } from '@augurproject/sdk';
import { MarketTypeName } from '@augurproject/sdk/build/state/logs/types';

export async function dispute(user: ContractAPI, market: MarketInfo): Promise<void> {
  const SOME_REP = new BigNumber(1e18).times(6e7);

  const payoutNumerators = getPayoutNumerators(market, 'invalid');
  const conflictOutcome = market.marketType === MarketTypeName.Scalar ? makeValidScalarOutcome(market) : 1;
  const conflictNumerators = getPayoutNumerators(market, conflictOutcome);

  const marketContract = user.augur.contracts.marketFromAddress(market.id);

  await user.repFaucet(SOME_REP);

  // Get past the market time, into when we can accept the initial report.
  await user.setTimestamp(new BigNumber(market.endTime + 1));

  // Do the initial report, creating the first dispute window.
  await user.doInitialReport(marketContract, payoutNumerators, '', SOME_REP.toString());

  // Contribution (dispute) fulfills the first dispute bond,
  // pushing into next dispute round that takes additional stake into account.
  await user.contribute(marketContract, conflictNumerators, SOME_REP);

  // TODO needed?
  // Enter the dispute window.
  const disputeWindow = user.augur.contracts.disputeWindowFromAddress(await marketContract.getDisputeWindow_());
  const disputeWindowStartTime = await disputeWindow.getStartTime_();
  await user.setTimestamp(disputeWindowStartTime.plus(1));

  // TODO use market.getDisputePacingOn and iteration like in fork() to enter slow pacing if param slow=true
  // apparently just needs one more dispute to go slow!
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
