import { BigNumber } from 'bignumber.js';
import { GasStation } from '..';
import { CLAIM_GAS_COST, DEFAULT_GAS_PRICE_IN_GWEI, EULERS_NUMBER, INVALID_OUTCOME, MINIMUM_INVALID_ORDER_VALUE_IN_ATTO_DAI, SECONDS_IN_A_YEAR, WORST_CASE_FILL } from '../constants';
import { MarketData } from '../logs';

// A Market is marked as True in the invalidFilter if the any bid for Invalid on the book would be profitable to take were the market Valid
const recalcInvalidFilter = (
  invalidOutcomeWeight: BigNumber,
  invalidOutcomeLiquidity: BigNumber,
  marketData: MarketData,
  feeMultiplier: BigNumber,
  gasLevels: GasStation,
  ETHInAttoCash: BigNumber, // use 1e18 for ETH, need to pass in for USDC
): number => {
  if (invalidOutcomeLiquidity.eq(0)) return 0;

  let gasPriceInGwei = DEFAULT_GAS_PRICE_IN_GWEI;
  if (gasLevels && gasLevels.standard) {
    gasPriceInGwei = Number(new BigNumber(gasLevels.standard).dividedBy(10 ** 9));
  }

  // TODO: get better est than 2 outcome estimate
  const estimatedTradeGasCost = ETHInAttoCash.multipliedBy(
    WORST_CASE_FILL[2]
  ).div(10 ** 9);

  const estimatedClaimGasCost = ETHInAttoCash.multipliedBy(
    CLAIM_GAS_COST
  ).div(10 ** 9);

  let timeTillMarketFinalizesInSeconds = new BigNumber(
    marketData.endTime
  ).minus(new Date().getTime() / 1000);

  if (timeTillMarketFinalizesInSeconds.lt(0))
    timeTillMarketFinalizesInSeconds = new BigNumber(0);
  const timeTillMarketFinalizesInYears = timeTillMarketFinalizesInSeconds.div(
    SECONDS_IN_A_YEAR
  );

  const numTicks = new BigNumber(marketData.numTicks);

  let baseRevenue = numTicks.multipliedBy(feeMultiplier);
  baseRevenue = baseRevenue.multipliedBy(
    (
      EULERS_NUMBER **
      timeTillMarketFinalizesInYears
        .multipliedBy(-0.15)
        .precision(14)
        .toNumber()
    ).toPrecision(14)
  );

  let baseCost = estimatedTradeGasCost.plus(
    estimatedClaimGasCost
  );

  const cashWeight = new BigNumber(1).minus(invalidOutcomeWeight);
  const invalidWeight = new BigNumber(invalidOutcomeWeight);

  const validRevenue = invalidWeight.multipliedBy(baseRevenue);
  const validCost = baseCost.plus(
    invalidWeight.multipliedBy(numTicks.minus(cashWeight))
  );

  if (
    validRevenue
      .minus(validCost)
      .gt(MINIMUM_INVALID_ORDER_VALUE_IN_ATTO_DAI)
  ) {
    return 1;
  }


  return 0;
}
