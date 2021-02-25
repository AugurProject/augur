import { BigNumber } from 'bignumber.js';
import { GasStation } from '..';
import { CLAIM_GAS_COST, DEFAULT_GAS_PRICE_IN_GWEI, EULERS_NUMBER, INVALID_SWAP_GAS_COST, MINIMUM_INVALID_ORDER_VALUE_IN_ATTO_DAI, SECONDS_IN_A_YEAR } from '../constants';

// A Market is marked as True in the invalidFilter if the any bid for Invalid on the book would be profitable to take were the market Valid
export const isMarketInvalid = (
  invalidOutcomeWeight: BigNumber,
  cashOutcomeWeight: BigNumber,
  invalidOutcomeLiquidity: BigNumber,
  invalidOutcomePrice: BigNumber,
  marketData: { endTime: number, numTicks: number, feeDivisor: number },
  reportingFeeDivisor: number,
  gasLevels: GasStation,
  ETHInAttoCash: BigNumber, // use 1e18 for ETH, need to pass in for USDC
  ETHToCash: BigNumber, // convert ETH to cash terms for tx costs
): boolean => {
  if (invalidOutcomeLiquidity.eq(0) || invalidOutcomePrice.eq(0)) return false;

  const feeDivisor = new BigNumber(marketData.feeDivisor);
  const numTicks = new BigNumber(marketData.numTicks);
  const feeMultiplier = new BigNumber(1)
    .minus(new BigNumber(1).div(reportingFeeDivisor))
    .minus(new BigNumber(1).div(feeDivisor));

  let gasPriceInGwei = DEFAULT_GAS_PRICE_IN_GWEI;
  if (gasLevels && gasLevels.standard) {
    gasPriceInGwei = Number(new BigNumber(gasLevels.standard).dividedBy(10 ** 9));
  }

  // TODO: get better est than 2 outcome estimate
  const estimatedTradeGasCost = ETHInAttoCash.times(
    INVALID_SWAP_GAS_COST
  ).div(10 ** 9);

  const estimatedClaimGasCost = ETHInAttoCash.times(
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

  const baseRevenue = numTicks.times(feeMultiplier).times(
    (
      EULERS_NUMBER **
      timeTillMarketFinalizesInYears
        .times(-0.15)
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
  // a ** 9 = x
  console.log('invalidOutcomeWeight.plus(cashOutcomeWeight)', String(cashOutcomeWeight.plus(invalidOutcomeWeight)))
  const weightcalc = cashOutcomeWeight.div(invalidOutcomeWeight);
  console.log('weightcalc', String(weightcalc))
  // todo: replace this with eth_call
  const priceWeightCalc = (priceCalc.pow(1)).minus(new BigNumber(1));
  const invalidRevenue = invalidOutcomeLiquidity.times(priceWeightCalc);

  return invalidRevenue
    .minus(totalInvalidCost)
    .gt(0)
    ? true : false;
}
