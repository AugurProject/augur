import { NULL_ADDRESS } from '../constants';
import { ContractInterfaces } from '@augurproject/core';
import { BigNumber } from 'bignumber.js';
import { ContractAPI } from '..';

export async function fork(user: ContractAPI, market: ContractInterfaces.Market): Promise<boolean> {
    const MAX_DISPUTES = 20;
    const SOME_REP = new BigNumber(1e18).times(6e7);

    const numberOfOutcomes = await market.getNumberOfOutcomes_();

    const payoutNumerators = createPayoutNumerators(numberOfOutcomes, 0, new BigNumber(100));
    const conflictNumerators = createPayoutNumerators(numberOfOutcomes, 1, new BigNumber(100));

    await user.repFaucet(SOME_REP);

    // Get past the market time, into when we can accept the initial report.
    await user.setTimestamp((await market.getEndTime_()).plus(1));

    // Do the initial report, creating the first dispute window.
    await user.doInitialReport(market, payoutNumerators, '', SOME_REP.toString());

    // Contribution (dispute) fulfills the first dispute bond,
    // pushing into next dispute round that takes additional stake into account.
    await user.contribute(market, conflictNumerators, SOME_REP);

    for (let i = 0; i < MAX_DISPUTES; i++) {
      if ((await market.getForkingMarket_()) !== NULL_ADDRESS) {
        return true; // forked successfully!
      }

      const disputeWindow = user.augur.contracts.disputeWindowFromAddress(await market.getDisputeWindow_());

      // Enter the dispute window.
      await user.setTimestamp((await disputeWindow.getStartTime_()).plus(1));

      // Contribute aka dispute. Opposing sides to keep raising the stakes.
      const numerators = i % 2 === 0 ? conflictNumerators : payoutNumerators;
      await user.contribute(market, numerators, SOME_REP);
    }

    return false; // failed to fork
}

function createPayoutNumerators(length: BigNumber, index: number, numTicks: BigNumber): BigNumber[] {
  const numerators: BigNumber[] = [];
  for (let i = 0; i < length.toNumber(); i++) {
    numerators.push(new BigNumber(0));
  }
  numerators[index] = numTicks;
  return numerators;
}
