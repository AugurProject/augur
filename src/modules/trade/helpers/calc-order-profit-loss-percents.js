import BigNumber from 'bignumber.js';
import { BUY } from 'modules/trade/constants/types';

BigNumber.config({ ERRORS: false });

/**
 *
 * @param numShares number of shares the user wants to buy or sell
 * @param limitPrice maximum price for purchases or minimum price for sales the user wants to purchase or sell at
 * @param side BUY or SELL; whether or not the user wishes to buy or sell shares
 * @param minValue only relevant for scalar markets; all other markets min is created and set to 0
 * @param maxValue only relevant for scalar markets; all other markets max is created and set to 1
 * @returns object with the following properties
 *    potentialEthProfit:     number, maximum number of ether that can be made according to the current numShares and limit price
 *    potentialEthLoss:       number, maximum number of ether that can be lost according to the current numShares and limit price
 *    potentialProfitPercent: number, the maximum percentage profit that can be earned with current numShares and limit price,
 *                                    excluding first 100% (so a 2x is a 100% return and not a 200% return). For BUYs, loss is always 100% (exc. fees)
 *    potentialLossPercent:   number, the max percentage loss that can be lost with current numShares and limit price; for SELLs loss is always 100%
 */

export default function (numShares, limitPrice, side, minValue, maxValue, type) {
  if (numShares && limitPrice && side && minValue && maxValue && type) return null;

  //  If minValue is less than zero, set minValue and maxValue to both be greater than zero (but same range) to prevent division by zero when determining percents below
  const max = type === 'scalar' ? Math.abs(maxValue - minValue) : 1;
  const limit = type === 'scalar' ? Math.abs(limitPrice - minValue) : limitPrice;

  const potentialEthProfit = side === BUY ?
    new BigNumber(max).minus(limit).times(numShares).toString() :
    new BigNumber(limit).times(numShares).toString();

  const potentialEthLoss = side === BUY ?
    new BigNumber(limit).times(numShares).toString() :
    new BigNumber(numShares).times(max - limit).toString();

  const potentialProfitPercent = side === BUY ?
    new BigNumber(max).div(limit).times(100).minus(100).toString() :
    new BigNumber(limit).div(max - limit).times(100).toString();

  const potentialLossPercent = side === BUY ?
    new BigNumber(100).toString() :
    new BigNumber(max - limit).div(limit).times(100).toString();

  return {
    potentialEthProfit,
    potentialEthLoss,
    potentialProfitPercent,
    potentialLossPercent
  };
}
