import { BigNumber } from 'bignumber.js';
import { GasStation } from '..';
import { CLAIM_GAS_COST, DEFAULT_GAS_PRICE_IN_GWEI, EULERS_NUMBER, INVALID_SWAP_GAS_COST, MINIMUM_INVALID_ORDER_VALUE_IN_ATTO_DAI, SECONDS_IN_A_YEAR } from '../constants';

// A Market is marked as True in the invalidFilter if the any bid for Invalid on the book would be profitable to take were the market Valid
export const isMarketInvalid = (
  invalidOutcomeWeight: BigNumber,
  cashOutcomeWeight: BigNumber,
  invalidOutcomeLiquidity: BigNumber,
  invalidOutcomePrice: BigNumber,
  marketData: { endTime: number, numTicks: number},
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
    INVALID_SWAP_GAS_COST
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

  const baseRevenue = numTicks.multipliedBy(feeMultiplier).multipliedBy(
    (
      EULERS_NUMBER **
      timeTillMarketFinalizesInYears
        .multipliedBy(-0.15)
        .precision(14)
        .toNumber()
    ).toPrecision(14)
  );

  let invalidEstimates = estimatedTradeGasCost.plus(
    estimatedClaimGasCost
  );

  const totalInvalidCost = baseRevenue.plus(invalidEstimates);
  const targetPrice = new BigNumber(0.02);
  const priceCalc = targetPrice.div(invalidOutcomePrice)
  const weightcalc = invalidOutcomeWeight.div(invalidOutcomeWeight.plus(cashOutcomeWeight));
  const priceWeightCalc = (priceCalc.pow(weightcalc)).minus(new BigNumber(1));
  const invalidRevenue = invalidOutcomeLiquidity.times(priceWeightCalc);

  if (
    invalidRevenue
      .minus(totalInvalidCost)
      .gt(0)
  ) {
    return 1;
  }


  return 0;
}
