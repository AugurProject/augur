import { MAX_FILLS_PER_TX } from '@augurproject/sdk-lite';
import memoize from 'memoizee';
import * as constants from 'modules/common/constants';
import {
  calcOrderProfitLossPercents,
  calcOrderShareProfitLoss,
  calculateTotalOrderValue,
} from 'modules/trades/helpers/calc-order-profit-loss-percents';
import { createBigNumber } from 'utils/create-big-number';
import { formatDaiPrice, formatMarketShares, formatDai, formatEther } from 'utils/format-number';

export const generateTrade = memoize(
  (market, outcomeTradeInProgress) => {
    const { settlementFee } = market;
    const side =
      (outcomeTradeInProgress?.side) || constants.BUY;
    const numShares =
      (outcomeTradeInProgress?.numShares) || null;
    const sharesFilled =
      (outcomeTradeInProgress?.sharesFilled) || null;
    const sharesFilledAvgPrice =
      (outcomeTradeInProgress?.sharesFilledAvgPrice) ||
      null;
    const limitPrice =
      (outcomeTradeInProgress?.limitPrice) || null;
    const totalFee = createBigNumber(
      (outcomeTradeInProgress?.totalFee) || "0",
      10,
    );
    const feePercent =
      (outcomeTradeInProgress?.feePercent) || "0";
    const totalCost = createBigNumber(
      (outcomeTradeInProgress?.totalCost) || "0",
      10,
    );
    const costInDai = createBigNumber(
      (outcomeTradeInProgress?.costInDai) || "0",
      10,
    )
    const shareCost = createBigNumber(
      (outcomeTradeInProgress?.shareCost) || "0",
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
      sharesFilled: formatMarketShares(marketType, sharesFilled),
      selfTrade: !!outcomeTradeInProgress.selfTrade,
      numFills: outcomeTradeInProgress?.numFills ? outcomeTradeInProgress.numFills.toNumber() : 0,
      loopLimit: outcomeTradeInProgress?.loopLimit ? outcomeTradeInProgress.loopLimit.toNumber() : MAX_FILLS_PER_TX.toNumber(),
      totalOrderValue: totalOrderValue
        ? formatEthValue(totalOrderValue)
        : null,
      orderShareProfit: orderShareProfitLoss
        ? formatEthValue(orderShareProfitLoss.potentialTradeProfit)
        : null,
      orderShareTradingFee: orderShareProfitLoss
        ? formatEthValue(orderShareProfitLoss.tradingFees)
        : null,
      potentialTradeProfit: preOrderProfitLoss
        ? formatEthValue(preOrderProfitLoss.potentialTradeProfit)
        : null,
      potentialTradeLoss: preOrderProfitLoss
        ? formatEthValue(preOrderProfitLoss.potentialTradeLoss)
        : null,
      tradingFees: preOrderProfitLoss
        ? formatEthValue(preOrderProfitLoss.tradingFees)
        : null,
      totalFee: formatEthValue(totalFee, { blankZero: true }),
      totalFeePercent: formatEthValue(feePercent, { blankZero: true }),
      totalCost: formatEthValue(totalCost.abs().toFixed(), {
        blankZero: false,
      }),
      costInDai: formatEthValue(costInDai.abs().toFixed(), {
        blankZero: false,
      }),
      shareCost: formatEthValue(shareCost.abs().toFixed(), {
        blankZero: false,
      }), // These are actually shares, but they can be formatted like DAI
    };
  },
  { max: 5 },
);

const formatEthValue = (value, options = {}) =>
  formatEther(
    value,
    Object.assign(
      { decimalsRounded: constants.UPPER_FIXED_PRECISION_BOUND },
      options,
    ),
  );
