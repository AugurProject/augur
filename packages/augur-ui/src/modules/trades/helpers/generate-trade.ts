import { createBigNumber } from "utils/create-big-number";
import memoize from "memoizee";
import { formatDai, formatShares } from "utils/format-number";
import {
  calcOrderProfitLossPercents,
  calcOrderShareProfitLoss,
  calculateTotalOrderValue,
} from "modules/trades/helpers/calc-order-profit-loss-percents";
import * as constants from "modules/common/constants";

export const generateTrade = memoize(
  (market, outcomeTradeInProgress) => {
    const { settlementFee } = market;
    const side =
      (outcomeTradeInProgress && outcomeTradeInProgress.side) || constants.BUY;
    const numShares =
      (outcomeTradeInProgress && outcomeTradeInProgress.numShares) || null;
    const sharesFilled =
      (outcomeTradeInProgress && outcomeTradeInProgress.sharesFilled) || null;
    const sharesFilledAvgPrice =
      (outcomeTradeInProgress && outcomeTradeInProgress.sharesFilledAvgPrice) ||
      null;
    const limitPrice =
      (outcomeTradeInProgress && outcomeTradeInProgress.limitPrice) || null;
    const totalFee = createBigNumber(
      (outcomeTradeInProgress && outcomeTradeInProgress.totalFee) || "0",
      10,
    );
    const feePercent =
      (outcomeTradeInProgress && outcomeTradeInProgress.feePercent) || "0";
    const totalCost = createBigNumber(
      (outcomeTradeInProgress && outcomeTradeInProgress.totalCost) || "0",
      10,
    );
    const shareCost = createBigNumber(
      (outcomeTradeInProgress && outcomeTradeInProgress.shareCost) || "0",
      10,
    );
    const marketType = (market && market.marketType) || null;
    const minPrice = createBigNumber(market.minPrice);
    const maxPrice = createBigNumber(market.maxPrice);

    const orderShareProfitLoss = shareCost.gt(0)
      ? calcOrderShareProfitLoss(
          limitPrice,
          side,
          minPrice,
          maxPrice,
          marketType,
          shareCost,
          sharesFilledAvgPrice,
          settlementFee,
          outcomeTradeInProgress.reversal,
        )
      : null;

    const preOrderProfitLoss = calcOrderProfitLossPercents(
      shareCost.gt(0) && numShares
        ? createBigNumber(numShares)
            .minus(shareCost)
            .toFixed(9)
        : numShares,
      limitPrice,
      side,
      minPrice,
      maxPrice,
      marketType,
      settlementFee,
    );

    const totalOrderValue = calculateTotalOrderValue(
      numShares,
      limitPrice,
      side,
      minPrice,
      maxPrice,
      marketType,
    );

    return {
      side,
      numShares,
      limitPrice,
      sharesFilled: formatShares(sharesFilled),
      selfTrade: !!outcomeTradeInProgress.selfTrade,
      totalOrderValue: totalOrderValue
        ? formatDaiValue(totalOrderValue)
        : null,
      orderShareProfit: orderShareProfitLoss
        ? formatDaiValue(orderShareProfitLoss.potentialEthProfit)
        : null,
      orderShareTradingFee: orderShareProfitLoss
        ? formatDaiValue(orderShareProfitLoss.tradingFees)
        : null,
      potentialEthProfit: preOrderProfitLoss
        ? formatDaiValue(preOrderProfitLoss.potentialEthProfit)
        : null,
      potentialEthLoss: preOrderProfitLoss
        ? formatDaiValue(preOrderProfitLoss.potentialEthLoss)
        : null,
      potentialLossPercent: preOrderProfitLoss
        ? formatDaiValue(preOrderProfitLoss.potentialLossPercent)
        : null,
      potentialProfitPercent: preOrderProfitLoss
        ? formatDaiValue(preOrderProfitLoss.potentialProfitPercent)
        : null,
      tradingFees: preOrderProfitLoss
        ? formatDaiValue(preOrderProfitLoss.tradingFees)
        : null,
      totalFee: formatDaiValue(totalFee, { blankZero: true }),
      totalFeePercent: formatDaiValue(feePercent, { blankZero: true }),
      totalCost: formatDaiValue(totalCost.abs().toFixed(), {
        blankZero: false,
      }),
      shareCost: formatDaiValue(shareCost.abs().toFixed(), {
        blankZero: false,
      }), // These are actually shares, but they can be formatted like DAI
    };
  },
  { max: 5 },
);

const formatDaiValue = (value, options = {}) =>
  formatDai(
    value,
    Object.assign(
      { decimalsRounded: constants.UPPER_FIXED_PRECISION_BOUND },
      options,
    ),
  );
