import { NULL_ADDRESS } from '../constants';
import { BigNumber } from 'bignumber.js';
import { ContractAPI } from '..';
import { MarketInfo } from '@augurproject/sdk-lite';
import { calculatePayoutNumeratorsArray } from '@augurproject/sdk';
import { ContractInterfaces } from '@augurproject/core';

export async function fork(user: ContractAPI, market: ContractInterfaces.Market): Promise<boolean> {
  const MAX_DISPUTES = 20;
  const SOME_REP = new BigNumber(1e18).times(10e2);
  const numOutcomes = await market.getNumberOfOutcomes_();
  const numTicks = await market.getNumTicks_();

  const payoutNumerators = [numTicks, ...(new Array(numOutcomes.minus(1).toNumber()).fill(new BigNumber(0)))];
  const conflictNumerators = [...payoutNumerators].reverse();

  await user.faucetRep(SOME_REP);
  // Get past the market time, into when we can accept the initial report.
  const endTime = await market.getEndTime_();
  await user.setTimestamp(endTime.plus(1));
  // Do the initial report, creating the first dispute window.
  await user.doInitialReport(market, payoutNumerators, '', SOME_REP.toString());
  // Contribution (dispute) fulfills the first dispute bond,
  // pushing into next dispute round that takes additional stake into account.
  await user.faucetRep(SOME_REP);
  await user.contribute(market, conflictNumerators, SOME_REP);
  for (let i = 0; i < MAX_DISPUTES; i++) {
    if ((await market.getForkingMarket_()) !== NULL_ADDRESS) {
      return true; // forked successfully!
    }

    const disputeWindow = user.augur.contracts.disputeWindowFromAddress(await market.getDisputeWindow_());
    // Enter the dispute window.
    const disputeWindowStartTime = await disputeWindow.getStartTime_();
    await user.setTimestamp(disputeWindowStartTime.plus(1));

    // Contribute aka dispute. Opposing sides to keep raising the stakes.
    const numerators = i % 2 === 0 ? conflictNumerators : payoutNumerators;
    await user.faucetRep(SOME_REP);
    await user.contribute(market, numerators, SOME_REP);
    const remainingToFill = await user.getRemainingToFill(
      market,
      numerators
    );
    await user.faucetRep(remainingToFill);
    if (remainingToFill.gt(0)) await user.contribute(market, numerators, remainingToFill);
  }

  return false; // failed to fork
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
