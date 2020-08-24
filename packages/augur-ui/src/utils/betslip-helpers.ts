import {
  convertToNormalizedPrice,
  convertToWin,
  getWager,
  getShares,
} from './get-odds';
import {
  INSUFFICIENT_FUNDS_ERROR,
  BUY,
  SELL,
  ZERO,
  ONE,
} from 'modules/common/constants';
import { getOutcomeNameWithOutcome } from './get-outcome';
import { BET_STATUS } from 'modules/trading/store/constants';
import { Markets } from 'modules/markets/store/markets';
import { placeTrade } from 'modules/contracts/actions/contractCalls';
import { Betslip } from 'modules/trading/store/betslip';
import { AppStatus } from 'modules/app/store/app-status';
import { createBigNumber } from './create-big-number';
import { totalTradingBalance } from 'modules/auth/helpers/login-account';
import { runSimulateTrade } from 'modules/trades/actions/update-trade-cost-shares';
import { calcOrderShareProfitLoss } from 'modules/trades/helpers/calc-order-profit-loss-percents';
import {
  DEFAULT_TRADE_INTERVAL,
  findMultipleOf,
} from 'modules/trading/helpers/form-helpers';
import { convertDisplayAmountToOnChainAmount } from '@augurproject/sdk';

export const convertPositionToBet = (position, marketInfo) => {
  const avgPrice = position.priorPosition
    ? position.priorPosition.avgPrice
    : position.averagePrice;
  const normalizedPrice = convertToNormalizedPrice({
    price: avgPrice,
    min: marketInfo.minPrice,
    max: marketInfo.maxPrice,
  });
  const netPosition = position.priorPosition
    ? position.priorPosition.netPosition
    : position.netPosition;
  const wager = getWager(netPosition, avgPrice);
  return {
    ...position,
    marketId: marketInfo.id,
    outcomeId: position.outcome,
    sportsBook: marketInfo.sportsBook,
    amountWon: '0',
    amountFilled: '0',
    price: avgPrice,
    max: marketInfo.maxPrice,
    min: marketInfo.minPrice,
    toWin: convertToWin(marketInfo.maxPrice, netPosition),
    normalizedPrice,
    outcome: getOutcomeNameWithOutcome(marketInfo, position.outcome.toString()),
    shares: netPosition,
    wager,
    dateUpdated: position.timestamp,
    closedOrderCost: position.priorPosition
      ? findProceeds(
          position.realizedPercent,
          position.realizedCost,
          marketInfo.settlementFee
        )
      : null,
    closedPotentialDaiProfit: position.priorPosition ? position.realized : null,
  };
};

export const findProceeds = (realizedPercent, realizedCost, settlementFee) => {
  const bnSettlementFee = createBigNumber(settlementFee, 10);
  const bnRealizedPercent = createBigNumber(realizedPercent);
  const bnRealizedCost = createBigNumber(realizedCost);

  const bnRealizedPercentPlusOne = ONE.plus(bnRealizedPercent);
  const a = bnRealizedPercentPlusOne.times(bnRealizedCost);
  const b = bnRealizedPercentPlusOne
    .times(bnRealizedCost)
    .times(bnSettlementFee);
  return a.plus(b);
};

const { FILLED, FAILED } = BET_STATUS;

export const placeBet = async (marketId, order, orderId) => {
  const { marketInfos } = Markets.get();
  const market = marketInfos[marketId];
  // todo: need to add user shares
  await placeTrade(
    0,
    marketId,
    market.numOutcomes,
    order.outcomeId,
    false,
    market.numTicks,
    market.minPrice,
    market.maxPrice,
    order.shares,
    order.price,
    0,
    '0',
    undefined
  )
    .then(() => {
      Betslip.actions.updateMatched(marketId, orderId, {
        ...order,
        marketId,
        sportsBook: market.sportsBook,
        status: FILLED,
      });
    })
    .catch(err => {
      Betslip.actions.updateMatched(marketId, orderId, {
        ...order,
        marketId,
        status: FAILED,
      });
    });
};

export const checkForDisablingPlaceBets = betslipItems => {
  let placeBetsDisabled = false;
  Object.values(betslipItems).map(market => {
    market.orders.map(order => {
      if (order.errorMessage && order.errorMessage !== '') {
        placeBetsDisabled = true;
      }
    });
  });
  return placeBetsDisabled;
};

export const checkForErrors = (marketId, order, orderId) => {
  runBetslipTrade(marketId, order, false, simulateTradeData => {
    Betslip.actions.modifyBet(marketId, orderId, {
      ...order,
      selfTrade: simulateTradeData.selfTrade,
      errorMessage: formulateBetErrorMessage(
        order.insufficientFunds,
        simulateTradeData.selfTrade
      ),
    });
  });
};

export const runBetslipTrade = (marketId, order, cashOut, cb) => {
  const { marketInfos } = Markets.get();
  const {
    loginAccount: { address },
    accountPositions,
  } = AppStatus.get();
  const market = marketInfos[marketId];

  if (!market) return null;

  let newTradeDetails: any = {
    side: cashOut ? SELL : BUY,
    limitPrice: order.price,
    numShares: order.shares,
  };

  (async () => {
    await runSimulateTrade(
      newTradeDetails,
      market,
      marketId,
      order.outcomeId,
      accountPositions,
      address,
      (err, simulateTradeData) => {
        cb && cb(simulateTradeData);
      }
    );
  })();
};

export const formulateBetErrorMessage = (insufficientFunds, selfTrade) => {
  if (selfTrade) {
    return 'Consuming own order';
  } else if (insufficientFunds) {
    return INSUFFICIENT_FUNDS_ERROR;
  } else {
    return '';
  }
};
export const checkInsufficientFunds = (
  minPrice,
  maxPrice,
  limitPrice,
  numShares
) => {
  const max = createBigNumber(maxPrice, 10);
  const min = createBigNumber(minPrice, 10);
  const marketRange = max.minus(min).abs();
  const displayLimit = createBigNumber(limitPrice, 10);
  const sharePriceLong = displayLimit.minus(min).dividedBy(marketRange);
  const longETH = sharePriceLong
    .times(createBigNumber(numShares))
    .times(marketRange);
  const longETHpotentialProfit = longETH;

  let availableDai = totalTradingBalance();

  return longETHpotentialProfit.gt(createBigNumber(availableDai));
};

const getTopBid = (orderBooks, bet, tickSize) => {
  const outcomeOrderBook = orderBooks[bet.marketId]?.orderBook[bet.outcomeId];
  if (!outcomeOrderBook || !outcomeOrderBook.bids) {
    return { topBidPrice: null, smallestPrice: null };
  }
  const outcomeOrderBookBids = outcomeOrderBook.bids.sort(
    (a, b) => Number(b.price) - Number(a.price)
  );
  let total = ZERO;
  let bids = [];
  const betSharesBN = createBigNumber(bet.shares);
  outcomeOrderBookBids.map(bid => {
    if (total.lt(betSharesBN)) {
      let bidSharesBN = createBigNumber(bid.shares);
      let newTotal = total.plus(bidSharesBN);
      if (newTotal.gt(betSharesBN)) {
        bidSharesBN = newTotal.minus(betSharesBN);
        newTotal = total.plus(bidSharesBN);
      }
      bids.push({
        price: bid.price,
        shares: bidSharesBN.toString(),
      });
      total = newTotal;
    }
  });

  if (total.lt(betSharesBN)) {
    return { topBidPrice: null, smallestPrice: null };
  }

  let weightedBidTotal = ZERO;
  bids.map(bid => {
    weightedBidTotal = weightedBidTotal.plus(
      createBigNumber(bid.price).times(createBigNumber(bid.shares))
    );
  });
  const topBidPrice = weightedBidTotal.div(betSharesBN);
  const tickSizeBN = createBigNumber(tickSize);
  const roundedPrice = Math.round(topBidPrice.div(tickSizeBN).toNumber());

  return {
    topBidPrice: createBigNumber(roundedPrice)
      .times(tickSizeBN)
      .toString(),
    smallestPrice: bids[bids.length - 1]?.price,
  };
};

export const getOrderShareProfitLoss = (bet, orderBooks, cb) => {
  const { marketInfos } = Markets.get();
  const market = marketInfos[bet.marketId];
  if (!market) return cb(null, null, null);
  const { topBidPrice, smallestPrice } = getTopBid(
    orderBooks,
    bet,
    market.tickSize
  );
  if (!topBidPrice) return cb(null, null, null);
  const trade = {
    ...bet,
    price: topBidPrice,
    reversal: {
      quantity: bet.shares,
      price: bet.price,
    },
  };

  runBetslipTrade(market.id, trade, true, simulateTradeData => {
    const { settlementFee } = market;
    const sharesFilledAvgPrice = (trade && trade.averagePrice) || null;
    const limitPrice = (trade && trade.price) || null;
    const shareCost = createBigNumber(
      (simulateTradeData && simulateTradeData.shareCost.value) || '0',
      10
    );
    const marketType = (market && market.marketType) || null;
    const minPrice = createBigNumber(market.minPrice);
    const maxPrice = createBigNumber(market.maxPrice);

    const orderShareProfitLoss = shareCost.gt(0)
      ? calcOrderShareProfitLoss(
          limitPrice,
          SELL,
          minPrice,
          maxPrice,
          marketType,
          shareCost,
          sharesFilledAvgPrice,
          settlementFee,
          trade.reversal
        )
      : null;

    const quantity = createBigNumber(
      Math.min(shareCost, trade.reversal.quantity)
    );
    const orderCost =
      orderShareProfitLoss &&
      createBigNumber(orderShareProfitLoss.potentialDaiProfit).plus(
        createBigNumber(trade.reversal.price).times(quantity)
      );
    cb(orderShareProfitLoss?.potentialDaiProfit, smallestPrice, orderCost);
  });
};

export const checkMultipleOfShares = (wager, price, market) => {
  const shares = getShares(wager, price);
  const tradeInterval = DEFAULT_TRADE_INTERVAL;
  if (
    !convertDisplayAmountToOnChainAmount(
      createBigNumber(shares),
      createBigNumber(market.tickSize)
    )
      .mod(tradeInterval)
      .isEqualTo(0)
  ) {
    const multipleOf = findMultipleOf(market);
    return `Quantity must be a multiple of ${multipleOf}. cur: ${shares}`;
  }
  return '';
};
