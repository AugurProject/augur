import { BigNumber } from 'bignumber.js';
import { ContractAPI } from '..';
import { ContractInterfaces } from '@augurproject/core';

export async function dispute(user: ContractAPI, market: ContractInterfaces.Market, slow: boolean, rounds = 0): Promise<void> {
  const numOutcomes = await market.getNumberOfOutcomes_();
  const numTicks = await market.getNumTicks_();
  const SOME_REP = new BigNumber(1e18).times(6e7);

  const payoutNumerators = [numTicks, ...(new Array(numOutcomes.minus(1).toNumber()).fill(new BigNumber(0)))];
  const conflictNumerators = [...payoutNumerators].reverse();

  await user.faucetRep(SOME_REP);

  // Get past the market time, into when we can accept the initial report.
  const endTime = await market.getEndTime_();
  await user.setTimestamp(endTime.plus(1));

  // Do the initial report, creating the first dispute window.
  const extraStake = slow ? SOME_REP.toString() : '0';
  await user.doInitialReport(market, payoutNumerators, '', extraStake);
  // Contribution (dispute) fulfills the first dispute bond,
  // pushing into next dispute round that takes additional stake into account.
  await user.contribute(market, conflictNumerators, SOME_REP);
  // With pre-filled stake in initial report, pacing requires just one more dispute to enter slow mode.
  if (slow && rounds === 0) {
    await user.contribute(market, conflictNumerators, SOME_REP);
  }
  const roundsLeft = rounds - 2; // 2 rounds from above
  // fill dispute bonds for X number of rounds
  if (rounds > 0) {
    let i = 0;
    for(i; i < roundsLeft; i++) {
      console.log('round number', roundsLeft + i);
      let numerators = payoutNumerators;
      if (i % 2) numerators = conflictNumerators;
      await user.contribute(market, numerators, SOME_REP);
      await delay(5000); // give processing time to catch up
    }
  }
}

const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
