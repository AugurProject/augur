import BigNumber from 'bignumber.js';
import memoize from 'memoizee';
import { formatPercent, formatEtherTokens, formatShares, formatEther } from 'utils/format-number';
import calcOrderProfitLossPercents from 'modules/trade/helpers/calc-order-profit-loss-percents';
import { augur } from 'services/augurjs';
import { calculateMaxPossibleShares } from 'modules/market/selectors/helpers/calculate-max-possible-shares';
import { BIDS, ASKS } from 'modules/order-book/constants/order-book-order-types';
import { ZERO } from 'modules/trade/constants/numbers';
import * as TRANSACTIONS_TYPES from 'modules/transactions/constants/types';
import { updateTradesInProgress } from 'modules/trade/actions/update-trades-in-progress';
import { selectAggregateOrderBook } from 'modules/bids-asks/helpers/select-order-book';
import store from 'src/store';

/**
 * @param {Object} market
 * @param {Object} outcome
 * @param {Object} outcomeTradeInProgress
 * @param {Object} loginAccount
 * @param {Object} orderBooks Orders for market
 */
export const generateTrade = memoize((market, outcome, outcomeTradeInProgress, orderBooks) => {
  const { loginAccount } = store.getState();

  const side = (outcomeTradeInProgress && outcomeTradeInProgress.side) || TRANSACTIONS_TYPES.BUY;
  const numShares = (outcomeTradeInProgress && outcomeTradeInProgress.numShares) || null;
  const limitPrice = (outcomeTradeInProgress && outcomeTradeInProgress.limitPrice) || null;
  const totalFee = (outcomeTradeInProgress && outcomeTradeInProgress.totalFee) || 0;
  const gasFeesRealEth = (outcomeTradeInProgress && outcomeTradeInProgress.gasFeesRealEth) || 0;
  const totalCost = (outcomeTradeInProgress && outcomeTradeInProgress.totalCost) || 0;
  const marketType = (market && market.type) || null;
  const minPrice = (market && market.minPrice) || null;
  const maxPrice = (market && market.maxPrice) || null;
  const preOrderProfitLoss = calcOrderProfitLossPercents(numShares, limitPrice, side, minPrice, maxPrice, marketType);

  let maxNumShares;
  if (limitPrice != null) {
    const orders = augur.trading.orderBook.filterByPriceAndOutcomeAndUserSortByPrice(
      orderBooks[side === TRANSACTIONS_TYPES.BUY ? TRANSACTIONS_TYPES.SELL : TRANSACTIONS_TYPES.BUY],
      side,
      limitPrice,
      outcome.id,
      loginAccount.address
    );
    maxNumShares = formatShares(calculateMaxPossibleShares(
      loginAccount,
      orders,
      market.makerFee,
      market.settlementFee,
      market.cumulativeScale,
      outcomeTradeInProgress,
      market.type === 'scalar' ? market.minPrice : null)
    );
  } else {
    maxNumShares = formatShares(0);
  }

  return {
    side,
    numShares,
    limitPrice,
    maxNumShares,

    potentialEthProfit: preOrderProfitLoss ? formatEtherTokens(preOrderProfitLoss.potentialEthProfit) : null,
    potentialEthLoss: preOrderProfitLoss ? formatEtherTokens(preOrderProfitLoss.potentialEthLoss) : null,
    potentialLossPercent: preOrderProfitLoss ? formatPercent(preOrderProfitLoss.potentialLossPercent) : null,
    potentialProfitPercent: preOrderProfitLoss ? formatPercent(preOrderProfitLoss.potentialProfitPercent) : null,

    totalFee: formatEtherTokens(totalFee, { blankZero: true }),
    gasFeesRealEth: formatEther(gasFeesRealEth, { blankZero: true }),
    totalCost: formatEtherTokens(totalCost, { blankZero: false }),

    tradeTypeOptions: [
      { label: TRANSACTIONS_TYPES.BUY, value: TRANSACTIONS_TYPES.BUY },
      { label: TRANSACTIONS_TYPES.SELL, value: TRANSACTIONS_TYPES.SELL }
    ],

    tradeSummary: generateTradeSummary(generateTradeOrders(market, outcome, outcomeTradeInProgress)),
    updateTradeOrder: (shares, limitPrice, side) => store.dispatch(updateTradesInProgress(market.id, outcome.id, side, shares, limitPrice)),
    totalSharesUpToOrder: (orderIndex, side) => totalSharesUpToOrder(outcome.id, side, orderIndex, orderBooks)
  };
}, { max: 5 });

const totalSharesUpToOrder = memoize((outcomeID, side, orderIndex, orderBooks) => {
  const { orderCancellation } = store.getState();

  const sideOrders = selectAggregateOrderBook(outcomeID, orderBooks, orderCancellation)[side === TRANSACTIONS_TYPES.BUY ? BIDS : ASKS];

  return sideOrders.filter((order, i) => i <= orderIndex).reduce((p, order) => p + order.shares.value, 0);
}, { max: 5 });

export const generateTradeSummary = memoize((tradeOrders) => {
  let tradeSummary = { totalGas: ZERO, tradeOrders: [] };

  if (tradeOrders && tradeOrders.length) {
    tradeSummary = tradeOrders.reduce((p, tradeOrder) => {

      // total gas
      if (tradeOrder.data && tradeOrder.data.gasFees && tradeOrder.data.gasFees.value) {
        p.totalGas = p.totalGas.plus(new BigNumber(tradeOrder.data.gasFees.value, 10));
      }

      // trade order
      p.tradeOrders.push(tradeOrder);

      return p;

    }, tradeSummary);
  }

  tradeSummary.totalGas = formatEther(tradeSummary.totalGas);

  return tradeSummary;
}, { max: 5 });

export const generateTradeOrders = memoize((market, outcome, outcomeTradeInProgress) => {
  const tradeActions = outcomeTradeInProgress && outcomeTradeInProgress.tradeActions;
  if (!market || !outcome || !outcomeTradeInProgress || !tradeActions || !tradeActions.length) {
    return [];
  }
  const marketID = market.id;
  const outcomeID = outcome.id;
  const marketType = market.type;
  const outcomeName = outcome.name;
  const description = market.description;
  return tradeActions.map((tradeAction) => {
    const numShares = new BigNumber(tradeAction.shares, 10);
    const costEth = new BigNumber(tradeAction.costEth, 10).abs();
    const avgPrice = new BigNumber(costEth, 10).dividedBy(new BigNumber(numShares, 10));
    const noFeePrice = market.type === 'scalar' ? outcomeTradeInProgress.limitPrice : tradeAction.noFeePrice;
    return {
      type: TRANSACTIONS_TYPES[tradeAction.action],
      data: { marketID, outcomeID, marketType, outcomeName },
      description,
      numShares: formatShares(tradeAction.shares),
      avgPrice: formatEtherTokens(avgPrice),
      noFeePrice: formatEtherTokens(noFeePrice),
      tradingFees: formatEtherTokens(tradeAction.feeEth),
      feePercent: formatPercent(tradeAction.feePercent),
      gasFees: formatEther(tradeAction.gasEth)
    };
  });
}, { max: 5 });
