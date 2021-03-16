import { GasStation } from '@augurproject/utils';
import { BigNumber } from 'bignumber.js';
import { CLAIM_GAS_COST, DEFAULT_GAS_PRICE_IN_GWEI, INVALID_SWAP_GAS_COST, EULERS_NUMBER, SECONDS_IN_A_YEAR, BUY_COMPLETE_SETS_GAS_COST } from '../constants';

// A Market is marked as True in the invalidFilter if the any bid for Invalid on the book would be profitable to take were the market Valid
export const isMarketInvalid = (
  sellInvalidProfitInETH: BigNumber,
  invalidAmountSold: BigNumber,
  marketData: { endTime: number, numTicks: number, feeDivisor: number },
  reportingFeeDivisor: number,
  gasLevels: GasStation,
): boolean => {
  if (invalidAmountSold.eq(0)) return false;

  const feeDivisor = new BigNumber(marketData.feeDivisor);
  const numTicks = new BigNumber(marketData.numTicks);
  const feeMultiplier = feeDivisor.eq(0) ? new BigNumber(1) : new BigNumber(1)
    .minus(new BigNumber(1).div(reportingFeeDivisor))
    .minus(new BigNumber(1).div(feeDivisor));

  let gasPriceInGwei = DEFAULT_GAS_PRICE_IN_GWEI;
  if (gasLevels && gasLevels.standard) {
    gasPriceInGwei = Number(new BigNumber(gasLevels.standard).div(10 ** 9));
  }

  // gas estimates in ETH
  const estimatedTradeGasCostInETH = INVALID_SWAP_GAS_COST.times(gasPriceInGwei).div(10 ** 9);
  const estimatedClaimGasCostInETH = CLAIM_GAS_COST.times(gasPriceInGwei).div(10 ** 9);
  const estimatedBuyCompleteSetsInETH = BUY_COMPLETE_SETS_GAS_COST.times(gasPriceInGwei).div(10 ** 9);

  let timeTillMarketFinalizesInSeconds = new BigNumber(
    marketData.endTime
  ).minus(new Date().getTime() / 1000);

  if (timeTillMarketFinalizesInSeconds.lt(0))
    timeTillMarketFinalizesInSeconds = new BigNumber(0);
  const timeTillMarketFinalizesInYears = timeTillMarketFinalizesInSeconds.div(
    SECONDS_IN_A_YEAR
  );

  const baseRevenue = feeMultiplier.times(
    (
      EULERS_NUMBER **
      timeTillMarketFinalizesInYears
        .times(-0.15)
        .precision(14)
        .toNumber()
    ).toPrecision(14)
  ).abs();

  const invalidEstimatesInETH = estimatedTradeGasCostInETH.plus(
    estimatedClaimGasCostInETH
  ).plus(estimatedBuyCompleteSetsInETH);

  /**
   * cost is TVoM and transaction cost and the origianl purchase amount for shares
   */
  const totalInvalidCost = (invalidAmountSold.times(baseRevenue)).plus(invalidEstimatesInETH).plus(invalidAmountSold.times(numTicks));

/*
  console.log(sellInvalidProfitInETH.minus(totalInvalidCost).gt(0),
  'invalidAmountSold', invalidAmountSold.toFixed(8),
  'TVoM', invalidAmountSold.times(baseRevenue).toFixed(8),
  'totalInvalidCost', totalInvalidCost.toFixed(8),
  'sellInvalidProfitInETH', sellInvalidProfitInETH.toFixed(8))
*/
  return sellInvalidProfitInETH.gt(totalInvalidCost);
}
