import { BigNumber, createBigNumber } from 'utils/create-big-number'
import memoize from 'memoizee'
import { formatPercent, formatShares, formatEther } from 'utils/format-number'
import calcOrderProfitLossPercents from 'modules/trade/helpers/calc-order-profit-loss-percents'
import { augur } from 'services/augurjs'
import { calculateMaxPossibleShares } from 'modules/market/selectors/helpers/calculate-max-possible-shares'
import { BIDS, ASKS } from 'modules/order-book/constants/order-book-order-types'
import { ZERO } from 'modules/trade/constants/numbers'
import * as TRANSACTIONS_TYPES from 'modules/transactions/constants/types'
import { updateTradesInProgress } from 'modules/trade/actions/update-trades-in-progress'
import { selectAggregateOrderBook } from 'modules/bids-asks/helpers/select-order-book'
import store from 'src/store'

/**
 * @param {Object} market
 * @param {Object} outcome
 * @param {Object} outcomeTradeInProgress
 * @param {Object} loginAccount
 * @param {Object} orderBooks Orders for market
 */
export const generateTrade = memoize((market, outcome, outcomeTradeInProgress, orderBooks) => {
  const { loginAccount } = store.getState()

  const side = (outcomeTradeInProgress && outcomeTradeInProgress.side) || TRANSACTIONS_TYPES.BUY
  const numShares = (outcomeTradeInProgress && outcomeTradeInProgress.numShares) || null
  const sharesFilled = (outcomeTradeInProgress && outcomeTradeInProgress.sharesFilled) || null
  const limitPrice = (outcomeTradeInProgress && outcomeTradeInProgress.limitPrice) || null
  const totalFee = createBigNumber((outcomeTradeInProgress && outcomeTradeInProgress.totalFee) || '0', 10)
  const feePercent = (outcomeTradeInProgress && outcomeTradeInProgress.feePercent) || '0'
  const totalCost = createBigNumber((outcomeTradeInProgress && outcomeTradeInProgress.totalCost) || '0', 10)
  const shareCost = createBigNumber((outcomeTradeInProgress && outcomeTradeInProgress.shareCost) || '0', 10)
  const marketType = (market && market.marketType) || null
  const minPrice = (market && ((typeof market.minPrice === 'number') || (BigNumber.isBigNumber(market.minPrice)))) ? market.minPrice : null
  const maxPrice = (market && ((typeof market.maxPrice === 'number') || (BigNumber.isBigNumber(market.maxPrice)))) ? market.maxPrice : null
  const adjustedTotalCost = (totalCost.gt('0')) ? totalCost.minus(totalFee).abs().toFixed() : null
  const preOrderProfitLoss = calcOrderProfitLossPercents(numShares, limitPrice, side, minPrice, maxPrice, marketType, sharesFilled, adjustedTotalCost)

  let maxNumShares
  if (limitPrice != null) {
    const orders = augur.trading.filterAndSortByPrice({
      singleOutcomeOrderBookSide: (orderBooks[outcome.id] || {})[side === TRANSACTIONS_TYPES.BUY ? TRANSACTIONS_TYPES.SELL : TRANSACTIONS_TYPES.BUY],
      orderType: side,
      price: limitPrice,
      userAddress: loginAccount.address,
    })
    maxNumShares = formatShares(calculateMaxPossibleShares(
      loginAccount,
      orders,
      market.makerFee,
      market.settlementFee,
      market.cumulativeScale,
      outcomeTradeInProgress,
      market.type === 'scalar' ? market.minPrice : null,
    ))
  } else {
    maxNumShares = formatShares(0)
  }

  return {
    side,
    numShares,
    limitPrice,
    maxNumShares,
    sharesFilled,

    potentialEthProfit: preOrderProfitLoss ? formatEther(preOrderProfitLoss.potentialEthProfit) : null,
    potentialEthLoss: preOrderProfitLoss ? formatEther(preOrderProfitLoss.potentialEthLoss) : null,
    potentialLossPercent: preOrderProfitLoss ? formatPercent(preOrderProfitLoss.potentialLossPercent) : null,
    potentialProfitPercent: preOrderProfitLoss ? formatPercent(preOrderProfitLoss.potentialProfitPercent) : null,

    totalFee: formatEther(totalFee, { blankZero: true }),
    totalFeePercent: formatEther(feePercent, { blankZero: true }),
    totalCost: formatEther(totalCost.abs().toFixed(), { blankZero: false }),
    shareCost: formatEther(shareCost.abs().toFixed(), { blankZero: false }), // These are actually shares, but they can be formatted like ETH

    tradeTypeOptions: [
      { label: TRANSACTIONS_TYPES.BUY, value: TRANSACTIONS_TYPES.BUY },
      { label: TRANSACTIONS_TYPES.SELL, value: TRANSACTIONS_TYPES.SELL },
    ],

    tradeSummary: generateTradeSummary(generateTradeOrders(market, outcome, outcomeTradeInProgress)),
    updateTradeOrder: (shares, limitPrice, side, maxCost) => store.dispatch(updateTradesInProgress(market.id, outcome.id, side, shares, limitPrice, maxCost)),
    totalSharesUpToOrder: (orderIndex, side) => totalSharesUpToOrder(outcome.id, side, orderIndex, orderBooks),
  }
}, { max: 5 })

const totalSharesUpToOrder = memoize((outcomeId, side, orderIndex, orderBooks) => {
  const { orderCancellation } = store.getState()

  const sideOrders = selectAggregateOrderBook(outcomeId, orderBooks, orderCancellation)[side === TRANSACTIONS_TYPES.BUY ? BIDS : ASKS]

  return sideOrders.filter((order, i) => i <= orderIndex).reduce((p, order) => p + order.shares.value, 0)
}, { max: 5 })

export const generateTradeSummary = memoize((tradeOrders) => {
  let tradeSummary = { totalGas: ZERO, tradeOrders: [] }

  if (tradeOrders && tradeOrders.length) {
    tradeSummary = tradeOrders.reduce((p, tradeOrder) => {

      // trade order
      p.tradeOrders.push(tradeOrder)

      return p

    }, tradeSummary)
  }

  tradeSummary.totalGas = formatEther(tradeSummary.totalGas)

  return tradeSummary
}, { max: 5 })

export const generateTradeOrders = memoize((market, outcome, outcomeTradeInProgress) => {
  const tradeActions = outcomeTradeInProgress && outcomeTradeInProgress.tradeActions
  if (!market || !outcome || !outcomeTradeInProgress || !tradeActions || !tradeActions.length) {
    return []
  }
  const { description, marketType, id: marketId } = market
  const { id: outcomeId, name: outcomeName } = outcome
  return tradeActions.map((tradeAction) => {
    const numShares = createBigNumber(tradeAction.shares, 10)
    const costEth = createBigNumber(tradeAction.costEth, 10).abs()
    const avgPrice = createBigNumber(costEth, 10).dividedBy(createBigNumber(numShares, 10))
    const noFeePrice = marketType === 'scalar' ? outcomeTradeInProgress.limitPrice : tradeAction.noFeePrice
    return {
      type: TRANSACTIONS_TYPES[tradeAction.action],
      data: {
        marketId, outcomeId, marketType, outcomeName,
      },
      description,
      numShares: formatShares(tradeAction.shares),
      avgPrice: formatEther(avgPrice),
      noFeePrice: formatEther(noFeePrice),
      tradingFees: formatEther(tradeAction.feeEth),
      feePercent: formatPercent(tradeAction.feePercent),
    }
  })
}, { max: 5 })
