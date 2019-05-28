import { BigNumber, createBigNumber } from "utils/create-big-number";
import { SCALAR, BUY } from "modules/common-elements/constants";

/**
 *
 * @param numShares number of shares the user wants to buy or sell
 * @param limitPrice maximum price for purchases or minimum price for sales the user wants to purchase or sell at
 * @param side BUY or SELL; whether or not the user wishes to buy or sell shares
 * @param minPrice only relevant for scalar markets; all other markets min is created and set to 0
 * @param maxPrice only relevant for scalar markets; all other markets max is created and set to 1
 * @param type the market type
 * @param settlementFee
 * @returns object with the following properties
 *    potentialEthProfit:     number, maximum number of ether that can be made according to the current numShares and limit price
 *    potentialEthLoss:       number, maximum number of ether that can be lost according to the current numShares and limit price
 *    potentialProfitPercent: number, the maximum percentage profit that can be earned with current numShares and limit price,
 *                                    excluding first 100% (so a 2x is a 100% return and not a 200% return). For BUYs, loss is always 100% (exc. fees)
 *    potentialLossPercent:   number, the max percentage loss that can be lost with current numShares and limit price; for SELLs loss is always 100%
 */

export const calcOrderProfitLossPercents = (
  numShares,
  limitPrice,
  side,
  minPrice,
  maxPrice,
  type,
  settlementFee
) => {
  if (!minPrice || !maxPrice || !numShares || !side || !type || !limitPrice) {
    return null;
  }

  if (
    type === SCALAR &&
    (!minPrice ||
      (!BigNumber.isBigNumber(minPrice) && isNaN(minPrice)) ||
      !maxPrice ||
      (!BigNumber.isBigNumber(maxPrice) && isNaN(maxPrice)))
  ) {
    return null;
  }

  const max = createBigNumber(maxPrice, 10);
  const min = createBigNumber(minPrice, 10);
  const marketRange = max.minus(min).abs();

  const displayLimit = createBigNumber(limitPrice, 10);

  const sharePriceLong = displayLimit.minus(min).dividedBy(marketRange);
  const sharePriceShort = max.minus(displayLimit).dividedBy(marketRange);

  const longETH = sharePriceLong.times(numShares).times(marketRange);
  const shortETH = sharePriceShort.times(numShares).times(marketRange);

  const bnSettlementFee = createBigNumber(settlementFee, 10);
  const totalShareValue = longETH.plus(shortETH);
  const winningSettlementCost = totalShareValue.times(bnSettlementFee);

  const maxTotalTradeCostNoFee = side === BUY ? longETH : shortETH;

  const longETHPercentNoFee = shortETH
    .dividedBy(maxTotalTradeCostNoFee)
    .times(100);
  const shortETHPercentNoFee = longETH
    .dividedBy(maxTotalTradeCostNoFee)
    .times(100);

  const longETHpotentialProfit = longETH;
  const shortETHpotentialProfit = shortETH;
  const totalETHValueWinnable = side === BUY ? longETH : shortETH;

  const longETHPercentProfit = longETHpotentialProfit
    .dividedBy(totalETHValueWinnable)
    .times(100);
  const shortETHPercentProfit = shortETHpotentialProfit
    .dividedBy(totalETHValueWinnable)
    .times(100);

  const potentialEthProfit =
    side === BUY ? shortETHpotentialProfit : longETHpotentialProfit;

  const potentialEthLoss =
    side === BUY ? longETHpotentialProfit : shortETHpotentialProfit;

  const potentialProfitPercent =
    side === BUY ? shortETHPercentProfit : longETHPercentProfit;

  const potentialLossPercent =
    side === BUY ? shortETHPercentNoFee : longETHPercentNoFee;

  const tradingFees = winningSettlementCost;

  return {
    potentialEthProfit,
    potentialEthLoss,
    potentialProfitPercent,
    potentialLossPercent,
    tradingFees
  };
};

export const calcOrderShareProfitLoss = (
  limitPrice,
  side,
  minPrice,
  maxPrice,
  type,
  shareCost,
  sharesFilledAvgPrice,
  settlementFee,
  reversal
) => {
  if (!minPrice || !maxPrice || !shareCost || !side || !type || !limitPrice) {
    return null;
  }

  if (
    type === SCALAR &&
    (!minPrice ||
      (!BigNumber.isBigNumber(minPrice) && isNaN(minPrice)) ||
      !maxPrice ||
      (!BigNumber.isBigNumber(maxPrice) && isNaN(maxPrice)))
  ) {
    return null;
  }

  const max = createBigNumber(maxPrice, 10);
  const min = createBigNumber(minPrice, 10);
  const marketRange = max.minus(min).abs();

  const displayLimit = createBigNumber(limitPrice, 10);
  const userAveragePrice =
    sharesFilledAvgPrice && createBigNumber(sharesFilledAvgPrice, 10);
  const totalUserShareCost =
    (sharesFilledAvgPrice &&
      userAveragePrice.times(createBigNumber(shareCost).times(marketRange))) ||
    0;

  const sharePriceLong = displayLimit.minus(min).dividedBy(marketRange);
  const sharePriceShort = max.minus(displayLimit).dividedBy(marketRange);

  const longETH = sharePriceLong.times(shareCost).times(marketRange);
  const shortETH = sharePriceShort.times(shareCost).times(marketRange);

  const bnSettlementFee = createBigNumber(settlementFee, 10);
  const totalShareValue = longETH.plus(shortETH);
  const winningSettlementCost = totalShareValue.times(bnSettlementFee);

  let longETHpotentialProfit = longETH.minus(winningSettlementCost);
  let shortETHpotentialProfit = shortETH.minus(winningSettlementCost);

  if (side === BUY) {
    shortETHpotentialProfit = shortETH
      .minus(totalUserShareCost)
      .minus(winningSettlementCost);
  } else {
    longETHpotentialProfit = longETH
      .minus(totalUserShareCost)
      .minus(winningSettlementCost);
  }

  let potentialEthProfit =
    side === BUY ? shortETHpotentialProfit : longETHpotentialProfit;

  if (reversal) {
    const quantity = createBigNumber(Math.min(shareCost, reversal.quantity));
    if (side === BUY) {
      const normalizedPrice = max.minus(reversal.price);
      potentialEthProfit = shortETH
        .minus(createBigNumber(normalizedPrice).times(quantity))
        .minus(winningSettlementCost);
    } else {
      potentialEthProfit = longETH
        .minus(createBigNumber(reversal.price).times(quantity))
        .minus(winningSettlementCost);
    }
  }

  return {
    potentialEthProfit,
    tradingFees: winningSettlementCost
  };
};

export const calculateTotalOrderValue = (
  numShares,
  limitPrice,
  side,
  minPrice,
  maxPrice,
  type
) => {
  if (!minPrice || !maxPrice || !side || !type || !limitPrice) {
    return null;
  }

  if (
    type === SCALAR &&
    (!minPrice ||
      (!BigNumber.isBigNumber(minPrice) && isNaN(minPrice)) ||
      !maxPrice ||
      (!BigNumber.isBigNumber(maxPrice) && isNaN(maxPrice)))
  ) {
    return null;
  }

  const max = createBigNumber(maxPrice, 10);
  const min = createBigNumber(minPrice, 10);
  const marketRange = max.minus(min).abs();

  const displayLimit = createBigNumber(limitPrice, 10);

  const sharePriceLong = displayLimit.minus(min).dividedBy(marketRange);
  const sharePriceShort = max.minus(displayLimit).dividedBy(marketRange);

  const longETH = sharePriceLong.times(numShares).times(marketRange);
  const shortETH = sharePriceShort.times(numShares).times(marketRange);

  return side === BUY ? longETH : shortETH;
};
