import { GasStation } from '@augurproject/utils';
import { BigNumber } from 'bignumber.js';
import { CLAIM_GAS_COST, DEFAULT_GAS_PRICE_IN_GWEI, INVALID_SWAP_GAS_COST, EULERS_NUMBER, SECONDS_IN_A_YEAR } from '../constants';

// A Market is marked as True in the invalidFilter if the any bid for Invalid on the book would be profitable to take were the market Valid
export const isMarketInvalid = (
  sellInvalidProfitInETH: BigNumber,
  invalidOutcomeLiquidity: BigNumber,
  invalidAmountSold: BigNumber,
  marketData: { endTime: number, numTicks: number, feeDivisor: number },
  reportingFeeDivisor: number,
  gasLevels: GasStation,
): boolean => {
  if (invalidOutcomeLiquidity.eq(0)) return false;

  const feeDivisor = new BigNumber(marketData.feeDivisor);
  const numTicks = new BigNumber(marketData.numTicks);
  const feeMultiplier = new BigNumber(1)
    .minus(new BigNumber(1).div(reportingFeeDivisor))
    .minus(new BigNumber(1).div(feeDivisor));

  let gasPriceInGwei = DEFAULT_GAS_PRICE_IN_GWEI;
  if (gasLevels && gasLevels.standard) {
    gasPriceInGwei = Number(new BigNumber(gasLevels.standard).dividedBy(10 ** 9));
  }

  // gas estimates in ETH
  const estimatedTradeGasCost = INVALID_SWAP_GAS_COST.times(gasPriceInGwei);
  const estimatedClaimGasCost = CLAIM_GAS_COST.times(gasPriceInGwei);

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
  ).abs();

  const invalidEstimates = estimatedTradeGasCost.plus(
    estimatedClaimGasCost
  );

  const totalInvalidCost = (invalidAmountSold.times(baseRevenue)).plus(invalidEstimates);
  console.log(sellInvalidProfitInETH.gt(totalInvalidCost), 'totalInvalidCost', totalInvalidCost.toFixed(0), 'sellInvalidProfitInETH', sellInvalidProfitInETH.toFixed(0));

  return sellInvalidProfitInETH
    .minus(totalInvalidCost)
    .gt(0)
    ? true : false;
}
