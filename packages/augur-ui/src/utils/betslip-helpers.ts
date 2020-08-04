import { convertToNormalizedPrice, convertToWin, getWager } from './get-odds';
import { BUY_INDEX, INSUFFICIENT_FUNDS_ERROR, BUY, SELL } from 'modules/common/constants';
import { getOutcomeNameWithOutcome } from './get-outcome';
import { BET_STATUS } from 'modules/trading/store/constants';
import { Markets } from 'modules/markets/store/markets';
import { placeTrade, simulateTrade } from 'modules/contracts/actions/contractCalls';
import { Betslip } from 'modules/trading/store/betslip';
import { AppStatus } from 'modules/app/store/app-status';
import { createBigNumber } from './create-big-number';
import { totalTradingBalance } from 'modules/auth/helpers/login-account';
import { runSimulateTrade } from 'modules/trades/actions/update-trade-cost-shares';
import { calculateTotalOrderValue, calcOrderShareProfitLoss } from 'modules/trades/helpers/calc-order-profit-loss-percents';
import { chatButton } from 'modules/common/buttons.styles.less';
import { formatDaiValue } from 'modules/trades/helpers/generate-trade';
import { selectMarketOutcomeBestBidAsk } from 'modules/markets/selectors/select-market-outcome-best-bid-ask';

export const convertPositionToBet = (position, marketInfo) => {
  const normalizedPrice = convertToNormalizedPrice({
    price: position.averagePrice,
    min: marketInfo.minPrice,
    max: marketInfo.maxPrice
  });
  const wager = getWager(position.rawPosition, position.averagePrice);
  return {
    ...position,
    outcomeId: position.outcome,
    sportsBook: marketInfo.sportsBook,
    amountWon: '0',
    amountFilled: '0',
    price: position.averagePrice,
    max: marketInfo.maxPrice,
    min: marketInfo.minPrice,
    toWin: convertToWin(marketInfo.maxPrice, position.rawPosition),
    normalizedPrice,
    outcome: getOutcomeNameWithOutcome(marketInfo, position.outcome),
    shares: position.rawPosition,
    wager,
    dateUpdated: position.timestamp,
  };
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
        status: FILLED,
      });
    })
    .catch(err => {
      Betslip.actions.updateMatched(marketId, orderId, {
        ...order,
        status: FAILED,
      });
    });
};

export const checkForDisablingPlaceBets = (betslipItems) => {
  let placeBetsDisabled = false;
  Object.values(betslipItems).map(market => {
    market.orders.map(order => {
      if (order.errorMessage && order.errorMessage !== '') {
        placeBetsDisabled = true;
      }
    });
  });
  return placeBetsDisabled;
}

export const checkForErrors = (marketId, order, orderId) => {
  runBetslipTrade(marketId, order, false, (simulateTradeData) => {
    Betslip.actions.modifyBet(marketId, orderId, {
      ...order,
      selfTrade: simulateTradeData.selfTrade,
      errorMessage: formulateBetErrorMessage(order.insufficientFunds, simulateTradeData.selfTrade)
    });
  })
}

export const runBetslipTrade = (marketId, order, cashOut, cb) => {
  const { marketInfos } = Markets.get();
  const { loginAccount: { address }, accountPositions} = AppStatus.get();
  const market = marketInfos[marketId];

  if (!market) return null;

  let newTradeDetails: any = {
    side: cashOut ? SELL : BUY,
    limitPrice: order.price,
    numShares: order.shares,
  };

  (async() => {
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
}
export const checkInsufficientFunds = (minPrice, maxPrice, limitPrice, numShares) => {
  const max = createBigNumber(maxPrice, 10);
  const min = createBigNumber(minPrice, 10);
  const marketRange = max.minus(min).abs();
  const displayLimit = createBigNumber(limitPrice, 10);
  const sharePriceLong = displayLimit.minus(min).dividedBy(marketRange);
  const longETH = sharePriceLong.times(createBigNumber(numShares)).times(marketRange);
  const longETHpotentialProfit = longETH;

  let availableDai = totalTradingBalance();

  return longETHpotentialProfit.gt(createBigNumber(availableDai));
}

export const getOrderShareProfitLoss = (bet, orderBooks, cb) => {
  const { marketInfos } = Markets.get();
  const outcomeOrderBook = orderBooks[bet.marketId]?.orderBook[bet.outcomeId];
  const market = marketInfos[bet.marketId];
  const { topBid } = selectMarketOutcomeBestBidAsk(
    outcomeOrderBook,
    market.marketType,
    market.tickSize
  );

  const topBidPrice = topBid?.price?.value;
  const trade = {...bet, price: topBidPrice, reversal: {
    quantity: bet.shares,
    price: bet.price
  }};

  runBetslipTrade(market.id, trade, true, (simulateTradeData) => {
    const { settlementFee } = market;
    const sharesFilledAvgPrice =
      (trade && trade.averagePrice) ||
      null;
    const limitPrice =
      (trade && trade.price) || null;
    const shareCost = createBigNumber(
      (simulateTradeData && simulateTradeData.shareCost.value) || "0",
      10,
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
          trade.reversal,
        )
      : null;
  
      cb(formatDaiValue(orderShareProfitLoss?.potentialDaiProfit));
  });
}