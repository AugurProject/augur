import BigNumber from 'bignumber.js'
import { fix, strip0xPrefix, unfix } from 'speedomatic'
import { augur } from 'services/augurjs'
import { SUCCESS } from 'modules/transactions/constants/statuses'
import { ZERO, TEN_TO_THE_EIGHTEENTH_POWER } from 'modules/trade/constants/numbers'
import * as TYPES from 'modules/transactions/constants/types'
import { loadDataForMarketTransaction } from 'modules/transactions/actions/load-data-for-market-transaction'
import getOutcomeName from 'modules/market/helpers/get-outcome-name'
import { formatEther, formatPercent, formatRep, formatShares } from 'utils/format-number'
import { formatDate } from 'utils/format-date'
import logError from 'utils/log-error'

export const constructBasicTransaction = (hash, blockNumber, timestamp, gasFees, status = SUCCESS) => {
  const transaction = { hash, status }
  if (blockNumber) transaction.blockNumber = blockNumber
  if (timestamp) transaction.timestamp = formatDate(new Date(timestamp * 1000))
  if (gasFees) transaction.gasFees = formatEther(gasFees)
  return transaction
}

export function constructDefaultTransaction(eventName, log) {
  const transaction = { data: {} }
  transaction.type = eventName
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

export function constructCreateMarketTransaction(log, description) {
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

export function constructTradingProceedsClaimedTransaction(log, market) {
  const transaction = { data: {} }
  transaction.type = TYPES.CLAIM_TRADING_PROCEEDS
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
      change: formatRep(new BigNumber(log._value, 10).neg(), { positiveSign: true }),
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

export const constructCancelOrderTransaction = (log, marketId, marketType, description, outcomeId, outcomeName, minPrice, maxPrice, status) => {
  const displayPrice = augur.trading.denormalizePrice({ normalizedPrice: log.price, minPrice, maxPrice })
  const formattedPrice = formatEther(displayPrice)
  const formattedShares = formatShares(log.amount)
  const action = log.inProgress ? 'canceling' : 'canceled'
  const transaction = {
    [log.transactionHash]: {
      type: 'Cancel Order',
      id: log.transactionHash,
      status,
      description,
      data: {
        order: { type: log.orderType, shares: formattedShares },
        marketType,
        outcome: { name: outcomeName || outcomeId },
        outcomeId,
        marketId,
      },
      message: `${action} order to ${log.orderType} ${formattedShares.full} for ${formattedPrice.full} each`,
      numShares: formattedShares,
      noFeePrice: formattedPrice,
      avgPrice: formattedPrice,
      timestamp: formatDate(new Date(log.timestamp * 1000)),
      hash: log.transactionHash,
      totalReturn: log.inProgress ? null : formatEther(log.cashRefund),
      gasFees: log.gasFees && new BigNumber(log.gasFees, 10).gt(ZERO) ? formatEther(log.gasFees) : null,
      blockNumber: log.blockNumber,
      orderId: log.orderId,
    },
  }
  return transaction
}

export const constructCreateOrderTransaction = (log, marketId, marketType, description, outcomeId, outcomeName, minPrice, maxPrice, settlementFee, status) => {
  let orderType
  let action
  if (log.orderType === TYPES.BUY) {
    orderType = TYPES.BUY
    action = log.inProgress ? 'bidding' : 'bid'
  } else {
    orderType = TYPES.SELL
    action = log.inProgress ? 'asking' : 'ask'
  }
  const displayPrice = augur.trading.denormalizePrice({ normalizedPrice: log.price, minPrice, maxPrice })
  const formattedPrice = formatEther(displayPrice)
  const formattedShares = formatShares(log.amount)
  const fxpShares = fix(log.amount)
  const fxpPrice = fix(log.price)
  const fxpSettlementFee = fix(settlementFee)
  const fxpNoFeeCost = fxpPrice.times(fxpShares).dividedBy(TEN_TO_THE_EIGHTEENTH_POWER).floor()
  const fxpTotalCost = fxpNoFeeCost.plus(fxpSettlementFee)
  const fxpTotalCostPerShare = fxpTotalCost.dividedBy(fxpShares).times(TEN_TO_THE_EIGHTEENTH_POWER).floor()
  const fxpTotalReturn = fxpPrice.times(fxpShares).dividedBy(TEN_TO_THE_EIGHTEENTH_POWER)
    .floor()
    .minus(fxpSettlementFee)
  const fxpTotalReturnPerShare = fxpTotalReturn.dividedBy(fxpShares).times(TEN_TO_THE_EIGHTEENTH_POWER).floor()
  const transaction = {
    type: orderType,
    id: `${log.transactionHash}-${log.orderId}`,
    tradeGroupId: log.tradeGroupId,
    status,
    description,
    data: {
      marketType,
      outcomeName: outcomeName || outcomeId,
      outcomeId,
      marketId,
    },
    message: `${action} ${formattedShares.full} for ${formatEther(unfix(log.orderType === TYPES.BUY ? fxpTotalCostPerShare : fxpTotalReturnPerShare)).full} / share`,
    numShares: formattedShares,
    noFeePrice: formatEther(displayPrice),
    freeze: {
      verb: log.inProgress ? 'freezing' : 'froze',
      noFeeCost: orderType === TYPES.SELL ? undefined : formatEther(unfix(fxpNoFeeCost)),
      settlementFee: formatEther(settlementFee),
    },
    avgPrice: formattedPrice,
    timestamp: formatDate(new Date(log.timestamp * 1000)),
    hash: log.transactionHash,
    feePercent: formatPercent(unfix(fxpSettlementFee.dividedBy(fxpTotalCost).times(TEN_TO_THE_EIGHTEENTH_POWER).floor()).times(100)),
    totalCost: orderType === TYPES.BUY ? formatEther(unfix(fxpTotalCost)) : undefined,
    totalReturn: orderType === TYPES.SELL ? formatEther(unfix(fxpTotalReturn)) : undefined,
    gasFees: log.gasFees && new BigNumber(log.gasFees, 10).gt(ZERO) ? formatEther(log.gasFees) : null,
    blockNumber: log.blockNumber,
    orderId: log.orderId,
  }
  return transaction
}

export const constructFillOrderTransaction = (log, marketId, marketType, description, outcomeId, outcomeName, minPrice, maxPrice, settlementFee, status) => {
  const displayPrice = augur.trading.denormalizePrice({ normalizedPrice: log.price, minPrice, maxPrice })
  const formattedPrice = formatEther(displayPrice)
  const formattedShares = formatShares(log.amount)
  const bnShares = new BigNumber(log.amount, 10)
  const bnPrice = new BigNumber(log.price, 10)
  const bnSettlementFee = new BigNumber(settlementFee, 10)
  const bnTotalCost = bnPrice.times(bnShares).plus(bnSettlementFee)
  const bnTotalReturn = bnPrice.times(bnShares).minus(bnSettlementFee)
  const bnTotalCostPerShare = bnTotalCost.dividedBy(bnShares)
  const bnTotalReturnPerShare = bnTotalReturn.dividedBy(bnShares)
  let orderType
  let perfectOrderType
  let formattedTotalCost
  let formattedTotalReturn
  if (log.isMaker) {
    orderType = log.orderType === TYPES.SELL ? TYPES.MATCH_BID : TYPES.MATCH_ASK
    perfectOrderType = log.orderType === TYPES.SELL ? 'bought' : 'sold'
    formattedTotalCost = log.orderType === TYPES.SELL ? formatEther(bnTotalCost) : undefined
    formattedTotalReturn = log.orderType === TYPES.BUY ? formatEther(bnTotalReturn) : undefined
  } else {
    orderType = log.orderType === TYPES.BUY ? TYPES.BUY : TYPES.SELL
    perfectOrderType = log.orderType === TYPES.BUY ? 'bought' : 'sold'
    formattedTotalCost = log.orderType === TYPES.BUY ? formatEther(bnTotalCost) : undefined
    formattedTotalReturn = log.orderType === TYPES.SELL ? formatEther(bnTotalReturn) : undefined
  }
  const action = log.inProgress ? orderType : perfectOrderType
  const transaction = {
    type: orderType,
    id: `${log.transactionHash}-${log.orderId}`,
    tradeGroupId: log.tradeGroupId,
    status,
    description,
    data: {
      marketType,
      outcomeName: outcomeName || outcomeId,
      outcomeId,
      marketId,
    },
    message: `${action} ${formattedShares.full} for ${formatEther(log.orderType === TYPES.BUY ? bnTotalCostPerShare : bnTotalReturnPerShare).full} / share`,
    numShares: formattedShares,
    noFeePrice: formattedPrice,
    avgPrice: formattedPrice,
    timestamp: formatDate(new Date(log.timestamp * 1000)),
    settlementFee: formatEther(settlementFee),
    feePercent: formatPercent(bnSettlementFee.dividedBy(bnTotalCost).times(100)),
    totalCost: formattedTotalCost,
    totalReturn: formattedTotalReturn,
    gasFees: log.gasFees && new BigNumber(log.gasFees, 10).gt(ZERO) ? formatEther(log.gasFees) : null,
    blockNumber: log.blockNumber,
  }
  return transaction
}

export const constructTradingTransaction = (eventName, log, marketData, outcomeName, status = SUCCESS) => {
  const {
    marketType,
    description,
    minPrice,
    maxPrice,
    settlementFee,
  } = marketData
  switch (eventName) {
    case TYPES.CANCEL_ORDER:
      return constructCancelOrderTransaction(log, log.marketId, marketType, description, log.outcome, outcomeName, minPrice, maxPrice, status)
    case TYPES.CREATE_ORDER:
      return constructCreateOrderTransaction(log, log.marketId, marketType, description, log.outcome, outcomeName, minPrice, maxPrice, settlementFee, status)
    case TYPES.FILL_ORDER:
      return constructFillOrderTransaction(log, log.marketId, marketType, description, log.outcome, outcomeName, minPrice, maxPrice, settlementFee, status)
    default:
      return null
  }
}

export const constructTransaction = (eventName, log, callback = logError) => (dispatch, getState) => {
  console.info('constructTransaction', eventName, log)
  switch (eventName) {
    case TYPES.APPROVAL:
      return callback(null, constructApprovalTransaction(log))
    case TYPES.TRANSFER:
      return callback(null, constructTransferTransaction(log, getState().loginAccount.address))
    case TYPES.CREATE_MARKET:
    case TYPES.CLAIM_TRADING_PROCEEDS:
    case TYPES.CANCEL_ORDER:
    case TYPES.CREATE_ORDER:
    case TYPES.FILL_ORDER:
      return dispatch(loadDataForMarketTransaction(eventName, log, (err, market) => {
        if (err) return callback(err)
        switch (eventName) {
          case TYPES.CREATE_MARKET:
            return callback(null, constructCreateMarketTransaction(log, market.description, dispatch))
          case TYPES.CLAIM_TRADING_PROCEEDS:
            return callback(null, constructTradingProceedsClaimedTransaction(log, market, dispatch))
          default:
            callback(null, constructTradingTransaction(eventName, log, market, getOutcomeName(market.marketType, market.id, log.outcome, getState().outcomesData[market.id])))
        }
      }))
    default:
      console.warn(`constructing default transaction for event ${eventName} (no handler found)`)
      callback(null, constructDefaultTransaction(eventName, log))
  }
}
