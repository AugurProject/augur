import { BigNumber, WrappedBigNumber } from 'utils/wrapped-big-number'
import { fix, strip0xPrefix, unfix } from 'speedomatic'
import { augur } from 'services/augurjs'
import { ZERO, TEN_TO_THE_EIGHTEENTH_POWER } from 'modules/trade/constants/numbers'
import { BINARY, SCALAR } from 'modules/markets/constants/market-types'
import * as TYPES from 'modules/transactions/constants/types'
import { formatEther, formatPercent, formatRep, formatShares } from 'utils/format-number'
import { formatDate } from 'utils/format-date'
import { loadMarketThenRetryConversion } from 'modules/transactions/actions/retry-conversion'

export function loadDataForMarketTransaction(label, log, isRetry, callback) {
  return (dispatch, getState) => {
    const { marketsData } = getState()
    const marketId = log.marketId || log.market
    const market = marketsData[marketId]
    if (!market || !market.description) {
      if (isRetry) return callback(log)
      return dispatch(loadMarketThenRetryConversion(marketId, label, log, callback))
    }
    return market
  }
}

export function loadDataForReportingTransaction(label, log, isRetry, callback) {
  return (dispatch, getState) => {
    const { marketsData, outcomesData } = getState()
    const marketId = log.market || log.marketId
    const market = marketsData[marketId]
    if (!market || !market.description) {
      if (isRetry) return callback(log)
      return dispatch(loadMarketThenRetryConversion(marketId, label, log, callback))
    }
    return { marketId, market, outcomes: outcomesData[marketId] }
  }
}

export const constructBasicTransaction = (hash, status, blockNumber, timestamp, gasFees) => (dispatch, getState) => {
  const transaction = { hash, status }
  if (blockNumber) transaction.blockNumber = blockNumber
  if (timestamp) transaction.timestamp = formatDate(new Date(timestamp * 1000))
  if (gasFees) transaction.gasFees = formatEther(gasFees)
  return transaction
}

export function constructDefaultTransaction(label, log) {
  const transaction = { data: {} }
  transaction.type = label
  transaction.message = log.message
  transaction.description = log.description || JSON.stringify(log)
  return transaction
}

export function constructApprovalTransaction(log) {
  const transaction = { data: {} }
  transaction.type = 'Approved to Send Tokens'
  transaction.description = `Approve ${log._spender} to send tokens`
  transaction.message = log.inProgress ? 'approving' : 'approved'
  return transaction
}

export function constructCollectedFeesTransaction(log) {
  const transaction = { data: {} }
  const repGain = WrappedBigNumber(log.repGain, 10)
  const initialRepBalance = log.initialRepBalance !== undefined ? log.initialRepBalance : WrappedBigNumber(log.newRepBalance).minus(repGain).toFixed()
  const action = log.inProgress ? 'reporting' : 'reported'
  transaction.message = `${action} with ${formatRep(initialRepBalance).full}`
  transaction.type = `Reporting Payment`
  if (log.totalReportingRep) {
    const totalReportingRep = WrappedBigNumber(log.totalReportingRep, 10)
    if (!totalReportingRep.eq(ZERO)) {
      const percentRep = formatPercent(WrappedBigNumber(initialRepBalance, 10).dividedBy(totalReportingRep).times(100), { decimals: 0 })
      transaction.message = `${transaction.message} (${percentRep.full})`
    }
  }
  transaction.description = `Reporting cycle #${log.period}`
  if (log.cashFeesCollected !== undefined && log.repGain !== undefined) {
    transaction.data.balances = [{
      change: formatEther(log.cashFeesCollected, { positiveSign: true }),
      balance: formatEther(log.newCashBalance),
    }, {
      change: formatRep(log.repGain, { positiveSign: true }),
      balance: formatRep(log.newRepBalance),
    }]
  }
  transaction.bond = { label: 'reporting', value: formatEther(log.notReportingBond) }
  return transaction
}

export function constructCreateMarketTransaction(log, description, dispatch) {
  const transaction = { data: {} }
  transaction.type = TYPES.CREATE_MARKET
  transaction.description = description.split('~|>')[0] // eslint-disable-line prefer-destructuring
  transaction.category = log.category
  transaction.marketCreationFee = formatEther(log.marketCreationFee)
  transaction.data.marketId = log.marketId ? log.marketId : null
  transaction.bond = { label: 'validity', value: formatEther(log.validityBond) }
  const action = log.inProgress ? 'creating' : 'created'
  transaction.message = `${action} market`
  return transaction
}

export function constructTradingProceedsClaimedTransaction(log, market, dispatch) {
  const transaction = { data: {} }
  transaction.type = 'Claim Trading Payout'
  transaction.description = market.description
  if (log.payoutTokens) {
    transaction.data.balances = [{
      change: formatEther(log.payoutTokens, { positiveSign: true }),
      balance: formatEther(log.tokenBalance),
    }]
  }
  transaction.data.shares = log.shares
  transaction.data.marketId = log.market ? log.market : null
  const action = log.inProgress ? 'closing out' : 'closed out'
  transaction.message = `${action} ${formatShares(log.shares).full}`
  return transaction
}

export function constructTransferTransaction(log, address) {
  const transaction = { data: {} }
  let action
  if (log._from === address) {
    transaction.type = 'Send Tokens'
    transaction.description = `Send tokens to ${strip0xPrefix(log._to)}`
    transaction.data.balances = [{
      change: formatRep(WrappedBigNumber(log._value, 10).negated(), { positiveSign: true }),
    }]
    action = log.inProgress ? 'sending' : 'sent'
  } else if (log._to === address) {
    transaction.type = 'Receive Tokens'
    transaction.description = `Receive tokens from ${strip0xPrefix(log._from)}`
    transaction.data.balances = [{
      change: formatRep(log._value, { positiveSign: true }),
    }]
    action = log.inProgress ? 'receiving' : 'received'
  }
  transaction.message = `${action} tokens`
  return transaction
}

export const constructCancelOrderTransaction = (trade, marketId, marketType, description, outcomeId, outcomeName, minPrice, maxPrice, status) => (dispatch, getState) => {
  const displayPrice = augur.trading.denormalizePrice({ normalizedPrice: trade.price, minPrice, maxPrice })
  const formattedPrice = formatEther(displayPrice)
  const formattedShares = formatShares(trade.amount)
  const action = trade.inProgress ? 'canceling' : 'canceled'
  return {
    [trade.transactionHash]: {
      type: TYPES.CANCEL_ORDER,
      status,
      description,
      data: {
        order: { type: trade.orderType, shares: formattedShares },
        marketType,
        outcome: { name: outcomeName || outcomeId },
        outcomeId,
        marketId,
      },
      message: `${action} order to ${trade.orderType} ${formattedShares.full} for ${formattedPrice.full} each`,
      numShares: formattedShares,
      noFeePrice: formattedPrice,
      avgPrice: formattedPrice,
      timestamp: formatDate(new Date(trade.timestamp * 1000)),
      hash: trade.transactionHash,
      totalReturn: trade.inProgress ? null : formatEther(trade.cashRefund),
      gasFees: trade.gasFees && WrappedBigNumber(trade.gasFees, 10).gt(ZERO) ? formatEther(trade.gasFees) : null,
      blockNumber: trade.blockNumber,
      orderId: trade.orderId,
    },
  }
}

export const constructCreateOrderTransaction = (trade, marketId, marketType, description, outcomeId, outcomeName, minPrice, maxPrice, settlementFee, status) => (dispatch, getState) => {
  let orderType
  let action
  if (trade.orderType === TYPES.BUY) {
    orderType = TYPES.BUY
    action = trade.inProgress ? 'bidding' : 'bid'
  } else {
    orderType = TYPES.SELL
    action = trade.inProgress ? 'asking' : 'ask'
  }
  const displayPrice = augur.trading.denormalizePrice({ normalizedPrice: trade.price, minPrice, maxPrice })
  const formattedPrice = formatEther(displayPrice)
  const formattedShares = formatShares(trade.amount)
  const fxpShares = fix(trade.amount)
  const fxpPrice = fix(trade.price)
  const fxpSettlementFee = fix(settlementFee)
  const fxpNoFeeCost = fxpPrice.times(fxpShares).dividedBy(TEN_TO_THE_EIGHTEENTH_POWER).integerValue(BigNumber.ROUND_FLOOR)
  const fxpTotalCost = fxpNoFeeCost.plus(fxpSettlementFee)
  const fxpTotalCostPerShare = fxpTotalCost.dividedBy(fxpShares).times(TEN_TO_THE_EIGHTEENTH_POWER).integerValue(BigNumber.ROUND_FLOOR)
  const fxpTotalReturn = fxpPrice.times(fxpShares).dividedBy(TEN_TO_THE_EIGHTEENTH_POWER)
    .integerValue(BigNumber.ROUND_FLOOR)
    .minus(fxpSettlementFee)
  const fxpTotalReturnPerShare = fxpTotalReturn.dividedBy(fxpShares).times(TEN_TO_THE_EIGHTEENTH_POWER).integerValue(BigNumber.ROUND_FLOOR)
  return {
    [trade.transactionHash]: {
      type: orderType,
      status,
      description,
      data: {
        marketType,
        outcomeName: outcomeName || outcomeId,
        outcomeId,
        marketId,
      },
      message: `${action} ${formattedShares.full} for ${formatEther(unfix(trade.orderType === TYPES.BUY ? fxpTotalCostPerShare : fxpTotalReturnPerShare)).full} / share`,
      numShares: formattedShares,
      noFeePrice: formatEther(displayPrice),
      freeze: {
        verb: trade.inProgress ? 'freezing' : 'froze',
        noFeeCost: orderType === TYPES.SELL ? undefined : formatEther(unfix(fxpNoFeeCost)),
        settlementFee: formatEther(settlementFee),
      },
      avgPrice: formattedPrice,
      timestamp: formatDate(new Date(trade.timestamp * 1000)),
      hash: trade.transactionHash,
      feePercent: formatPercent(unfix(fxpSettlementFee.dividedBy(fxpTotalCost).times(TEN_TO_THE_EIGHTEENTH_POWER).integerValue(BigNumber.ROUND_FLOOR)).times(100)),
      totalCost: orderType === TYPES.BUY ? formatEther(unfix(fxpTotalCost)) : undefined,
      totalReturn: orderType === TYPES.SELL ? formatEther(unfix(fxpTotalReturn)) : undefined,
      gasFees: trade.gasFees && WrappedBigNumber(trade.gasFees, 10).gt(ZERO) ? formatEther(trade.gasFees) : null,
      blockNumber: trade.blockNumber,
      orderId: trade.orderId,
    },
  }
}

export const constructFillOrderTransaction = (trade, marketId, marketType, description, outcomeId, outcomeName, minPrice, maxPrice, settlementFee, status) => (dispatch, getState) => {
  if (!trade.amount) return null
  if (!trade.price) return null
  const transactionId = `${trade.transactionHash}-${trade.orderId}`
  const { tradeGroupId } = trade
  const displayPrice = augur.trading.denormalizePrice({ normalizedPrice: trade.price, minPrice, maxPrice })
  const formattedPrice = formatEther(displayPrice)
  const formattedShares = formatShares(trade.amount)
  const bnShares = WrappedBigNumber(trade.amount, 10)
  const bnPrice = WrappedBigNumber(trade.price, 10)
  const bnSettlementFee = WrappedBigNumber(settlementFee, 10)
  const bnTotalCost = bnPrice.times(bnShares).plus(bnSettlementFee)
  const bnTotalReturn = bnPrice.times(bnShares).minus(bnSettlementFee)
  const bnTotalCostPerShare = bnTotalCost.dividedBy(bnShares)
  const bnTotalReturnPerShare = bnTotalReturn.dividedBy(bnShares)
  let orderType
  let perfectOrderType
  let formattedTotalCost
  let formattedTotalReturn
  if (trade.isMaker) {
    orderType = trade.orderType === TYPES.SELL ? TYPES.MATCH_BID : TYPES.MATCH_ASK
    perfectOrderType = trade.orderType === TYPES.SELL ? 'bought' : 'sold'
    formattedTotalCost = trade.orderType === TYPES.SELL ? formatEther(bnTotalCost) : undefined
    formattedTotalReturn = trade.orderType === TYPES.BUY ? formatEther(bnTotalReturn) : undefined
  } else {
    orderType = trade.orderType === TYPES.BUY ? TYPES.BUY : TYPES.SELL
    perfectOrderType = trade.orderType === TYPES.BUY ? 'bought' : 'sold'
    formattedTotalCost = trade.orderType === TYPES.BUY ? formatEther(bnTotalCost) : undefined
    formattedTotalReturn = trade.orderType === TYPES.SELL ? formatEther(bnTotalReturn) : undefined
  }
  const action = trade.inProgress ? orderType : perfectOrderType
  const transaction = {
    [transactionId]: {
      type: orderType,
      hash: trade.transactionHash,
      tradeGroupId,
      status,
      description,
      data: {
        marketType,
        outcomeName: outcomeName || outcomeId,
        outcomeId,
        marketId,
      },
      message: `${action} ${formattedShares.full} for ${formatEther(trade.orderType === TYPES.BUY ? bnTotalCostPerShare : bnTotalReturnPerShare).full} / share`,
      numShares: formattedShares,
      noFeePrice: formattedPrice,
      avgPrice: formattedPrice,
      timestamp: formatDate(new Date(trade.timestamp * 1000)),
      settlementFee: formatEther(settlementFee),
      feePercent: formatPercent(bnSettlementFee.dividedBy(bnTotalCost).times(100)),
      totalCost: formattedTotalCost,
      totalReturn: formattedTotalReturn,
      gasFees: trade.gasFees && WrappedBigNumber(trade.gasFees, 10).gt(ZERO) ? formatEther(trade.gasFees) : null,
      blockNumber: trade.blockNumber,
    },
  }
  return transaction
}

export const constructTradingTransaction = (label, trade, marketId, outcomeId, status) => (dispatch, getState) => {
  console.log('constructTradingTransaction:', label, trade)
  const { marketsData, outcomesData } = getState()
  const {
    marketType, description, minPrice, maxPrice, settlementFee,
  } = marketsData[marketId]
  const marketOutcomesData = outcomesData[marketId]
  let outcomeName
  if (marketType === BINARY || marketType === SCALAR) {
    outcomeName = null
  } else {
    outcomeName = (marketOutcomesData ? marketOutcomesData[outcomeId] : {}).name
  }
  switch (label) {
    case TYPES.CANCEL_ORDER: {
      return dispatch(constructCancelOrderTransaction(trade, marketId, marketType, description, outcomeId, outcomeName, minPrice, maxPrice, status))
    }
    case TYPES.CREATE_ORDER: {
      return dispatch(constructCreateOrderTransaction(trade, marketId, marketType, description, outcomeId, outcomeName, minPrice, maxPrice, settlementFee, status))
    }
    case TYPES.FILL_ORDER: {
      return dispatch(constructFillOrderTransaction(trade, marketId, marketType, description, outcomeId, outcomeName, minPrice, maxPrice, settlementFee, status))
    }
    default:
      return null
  }
}

export const constructTransaction = (label, log, isRetry, callback) => (dispatch, getState) => {
  switch (label) {
    case TYPES.APPROVAL:
      return constructApprovalTransaction(log)
    case TYPES.TRANSFER: {
      const { loginAccount } = getState()
      return constructTransferTransaction(log, loginAccount.address)
    }
    case TYPES.CREATE_MARKET: {
      const market = dispatch(loadDataForMarketTransaction(label, log, isRetry, callback))
      if (!market || !market.description) break
      return constructCreateMarketTransaction(log, market.description, dispatch)
    }
    case TYPES.PAYOUT: {
      const market = dispatch(loadDataForMarketTransaction(label, log, isRetry, callback))
      if (!market || !market.description) break
      return constructTradingProceedsClaimedTransaction(log, market, dispatch)
    }
    default:
      return constructDefaultTransaction(label, log)
  }
}
