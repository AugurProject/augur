import { NULL_ADDRESS } from '../constants';
import { BigNumber } from 'bignumber.js';
import { ContractAPI } from '..';
import { MarketInfo } from '@augurproject/sdk/build/state/getter/Markets';
import { MarketTypeName } from '@augurproject/sdk/build/state/logs/types';

export async function fork(user: ContractAPI, market: MarketInfo): Promise<boolean> {
  const MAX_DISPUTES = 20;
  const SOME_REP = new BigNumber(1e18).times(6e7);

  const payoutNumerators = getPayoutNumerators(market, new BigNumber(0));
  const conflictNumerators = getPayoutNumerators(market, new BigNumber(1));

  await user.repFaucet(SOME_REP);

  // Get past the market time, into when we can accept the initial report.
  await user.setTimestamp(new BigNumber(market.endTime + 1));

  const marketContract = user.augur.contracts.marketFromAddress(market.id);

  // Do the initial report, creating the first dispute window.
  await user.doInitialReport(marketContract, payoutNumerators, '', SOME_REP.toString());

  // Contribution (dispute) fulfills the first dispute bond,
  // pushing into next dispute round that takes additional stake into account.
  await user.contribute(marketContract, conflictNumerators, SOME_REP);

  for (let i = 0; i < MAX_DISPUTES; i++) {
    if ((await marketContract.getForkingMarket_()) !== NULL_ADDRESS) {
      return true; // forked successfully!
    }

    const disputeWindow = user.augur.contracts.disputeWindowFromAddress(await marketContract.getDisputeWindow_());

    // Enter the dispute window.
    await user.setTimestamp((await disputeWindow.getStartTime_()).plus(1));

    // Contribute aka dispute. Opposing sides to keep raising the stakes.
    const numerators = i % 2 === 0 ? conflictNumerators : payoutNumerators;
    await user.contribute(marketContract, numerators, SOME_REP);
  }

  return false; // failed to fork
}

function getPayoutNumerators(market: MarketInfo, outcome: BigNumber): BigNumber[] {
  const { marketType, numOutcomes } = market;
  const numTicks = new BigNumber(market.numTicks);

  // tslint:disable-next-line:ban
  const numerators: BigNumber[] = Array(numOutcomes).fill(new BigNumber(0));

  if (marketType === MarketTypeName.Scalar) {
    const maxPrice = new BigNumber(market.maxPrice);
    const minPrice = new BigNumber(market.minPrice);
    const priceRange = maxPrice.minus(minPrice);
    const longPayout = priceRange.times(numTicks).dividedBy(priceRange);
    const shortPayout = numTicks.minus(longPayout);
    // This is arbitrary since outcomes for scalar markets aren't quite like
    // yes/no and categorical market outcomes.
    if (outcome.eq(0)) {
      numerators[1] = shortPayout;
      numerators[2] = longPayout;
    } else {
      numerators[2] = shortPayout;
      numerators[1] = longPayout;
    }

  } else {
    numerators[outcome.toNumber()] = new BigNumber(numTicks);
  }

  return numerators;
}
