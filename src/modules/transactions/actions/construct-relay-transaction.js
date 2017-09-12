import { abi, augur, rpc } from 'services/augurjs'
import { ZERO } from 'modules/trade/constants/numbers'
import { SCALAR } from 'modules/markets/constants/market-types'
import * as TYPES from 'modules/transactions/constants/types'
import * as STATUSES from 'modules/transactions/constants/statuses'
import { updateTradeCommitment } from 'modules/trade/actions/update-trade-commitment'
import { deleteTransaction } from 'modules/transactions/actions/delete-transaction'
import { constructBasicTransaction, constructTradingTransaction, constructTransaction, loadDataForReportingTransaction } from 'modules/transactions/actions/construct-transaction'
import { fillOrder } from 'modules/bids-asks/actions/update-market-order-book'
import unpackTransactionParameters from 'modules/transactions/actions/unpack-transaction-parameters'
import { selectMarketFromEventID } from 'modules/market/selectors/market'
import selectWinningPositions from 'modules/my-positions/selectors/winning-positions'
import { addNotification } from 'modules/notifications/actions/update-notifications'

import makePath from 'modules/routes/helpers/make-path'

import { TRANSACTIONS } from 'modules/routes/constants/views'

export const constructRelayTransaction = (tx, status) => (dispatch, getState) => {
  const hash = tx.hash
  const p = {
    ...unpackTransactionParameters(tx),
    transactionHash: hash,
    blockNumber: tx.response.blockNumber && parseInt(tx.response.blockNumber, 16),
    timestamp: tx.response.timestamp || parseInt(Date.now() / 1000, 10),
    inProgress: !tx.response.blockHash
  }

  // console.log('unpacked:', JSON.stringify(p, null, 2));
  // console.log('status:', status);
  const method = tx.data.method
  const contracts = getState().contractAddresses
  const contract = Object.keys(contracts).find(c => contracts[c] === tx.data.to)
  const gasPrice = rpc.gasPrice || augur.constants.DEFAULT_GASPRICE
  const gasFees = tx.response.gasFees ? tx.response.gasFees : augur.trading.simulation.getTxGasEth({
    ...getState().functionsAPI[contract][method]
  }, gasPrice).toFixed()

  const { loginAccount } = getState()

  console.log('method -- ', method)

  switch (method) {
    case TYPES.BUY: {
      const { marketsData } = getState()
      const market = marketsData[abi.format_int256(p.market)]
      const amount = abi.unfix(p.amount, 'string')
      dispatch(addNotification({
        id: p.transactionHash,
        title: `Bid ${amount || ''} ${amount && 'Share'}${amount && parseFloat(amount, 10) === 1 ? '' : 's'} - ${status || tx.status}`,
        description: market.description || '',
        timestamp: p.timestamp,
        linkPath: makePath(TRANSACTIONS)
      }))
      return dispatch(constructTradingTransaction(TYPES.LOG_ADD_TX, {
        type: TYPES.BUY,
        ...p,
        amount,
        gasFees,
        price: abi.unfix_signed(p.price, 'string'),
      }, abi.format_int256(p.market), p.outcome, status))
    }
    case TYPES.SHORT_ASK:
      p.isShortAsk = true // eslint-disable-line no-fallthrough
    case TYPES.SELL: {
      const { marketsData } = getState()
      const market = marketsData[abi.format_int256(p.market)]
      const amount = abi.unfix(p.amount, 'string')
      dispatch(addNotification({
        id: p.transactionHash,
        title: `${p.isShortAsk ? 'short ask' : 'ask'} ${amount || ''} ${amount && 'Share'}${amount && parseFloat(amount, 10) === 1 ? '' : 's'} - ${status || tx.status}`,
        description: market.description || '',
        timestamp: p.timestamp,
        linkPath: makePath(TRANSACTIONS)
      }))
      return dispatch(constructTradingTransaction(TYPES.LOG_ADD_TX, {
        type: TYPES.SELL,
        ...p,
        price: abi.unfix_signed(p.price, 'string'),
        amount: abi.unfix(p.amount, 'string'),
        gasFees
      }, abi.format_int256(p.market), p.outcome, status))
    }
    case TYPES.CANCEL: {
      const order = augur.trading.takeOrder.selectOrder(p.trade_id, getState().orderBooks)

      if (tx.status === STATUSES.SUCCESS) {
        const { transactionsData } = getState()
        const cancelledOrder = transactionsData[p.transactionHash]

        dispatch(addNotification({
          id: p.transactionHash,
          title: `Cancel ${cancelledOrder.numShares.formatted} Share${cancelledOrder.numShares.value === 1 ? '' : 's'} - success`,
          description: cancelledOrder.description,
          timestamp: p.timestamp,
          linkPath: makePath(TRANSACTIONS)
        }))
      }

      if (!order) return null

      const { marketsData } = getState()
      const market = marketsData[abi.format_int256(order.market)]
      const amount = order.amount
      dispatch(addNotification({
        id: p.transactionHash,
        title: `Cancel ${amount || ''} ${amount && 'Share'}${amount && parseFloat(amount, 10) === 1 ? '' : 's'} - ${status || tx.status}`,
        description: market.description || '',
        timestamp: p.timestamp,
        linkPath: makePath(TRANSACTIONS)
      }))
      return dispatch(constructTradingTransaction(TYPES.LOG_CANCEL, {
        ...p,
        ...order,
        gasFees
      }, abi.format_int256(order.market), order.outcome, status))
    }
    case TYPES.COMMIT_TRADE: {
      dispatch(updateTradeCommitment({ transactionHash: hash }))
      const { isShortSell, tradeHash, orders, tradingFees, maxValue, remainingShares, gasFees } = getState().tradeCommitment
      const { marketsData } = getState()
      const numTradeIDs = orders.length
      const transactions = new Array(numTradeIDs)
      let market = {}
      let remainingEth = abi.bignum(maxValue)
      for (let i = 0; i < numTradeIDs; ++i) {
        const order = orders[i]
        market = marketsData[abi.format_int256(order.market)]
        let amount
        if (abi.bignum(remainingShares).gt(ZERO)) {
          if (abi.bignum(remainingShares).gt(abi.bignum(order.amount))) {
            amount = order.amount
          } else {
            amount = remainingShares
          }
        } else {
          let price
          if (market.type === SCALAR) {
            price = abi.bignum(augur.trading.shrinkScalarPrice(market.minValue, order.price))
          } else {
            price = abi.bignum(order.price)
          }
          console.log('price:', price.toFixed())
          amount = remainingEth.minus(abi.bignum(tradingFees)).dividedBy(price)
          console.log('amount:', amount.toFixed())
          if (amount.gt(abi.bignum(order.amount))) {
            amount = order.amount
          } else {
            amount = amount.toFixed()
          }
          remainingEth = remainingEth.minus(abi.bignum(amount).times(price))
          console.log('adjusted amount:', amount)
          console.log('remaining eth:', remainingEth.toFixed())
        }
        console.log('remainingShares:', remainingShares)
        console.log('calculated amount:', amount)
        const label = isShortSell ? TYPES.LOG_SHORT_FILL_TX : TYPES.LOG_FILL_TX
        console.log('commit order:', order)

        dispatch(addNotification({
          id: p.transactionHash,
          title: `Committing to ${order.type === TYPES.BUY ? TYPES.SELL : TYPES.BUY} ${amount || ''} ${amount && 'Share'}${amount && parseFloat(amount, 10) === 1 ? '' : 's'} - ${status}`,
          description: market.description || '',
          timestamp: p.timestamp,
          linkPath: makePath(TRANSACTIONS)
        }))
        transactions[i] = dispatch(constructTradingTransaction(label, {
          ...p,
          inProgress: true,
          price: order.price,
          outcome: parseInt(order.outcome, 10),
          amount,
          sender: tx.data.from,
          owner: order.owner,
          type: order.type === TYPES.BUY ? TYPES.SELL : TYPES.BUY,
          tradeid: order.id,
          tradeHash,
          takerFee: tradingFees,
          gasFees,
          isShortSell
        }, abi.format_int256(order.market), order.outcome, STATUSES.COMMITTING))
      }
      return transactions
    }
    case TYPES.SHORT_SELL: {
      const { transactionHash, orders, tradeHash, remainingShares, tradingFees, gasFees } = getState().tradeCommitment
      const order = orders[0]
      let amount = remainingShares
      if (abi.bignum(remainingShares).gt(abi.bignum(order.amount))) {
        amount = order.amount
      }
      let isEmptyTrade
      if (status === STATUSES.SUCCESS) {
        const unmatchedShares = abi.unfix(tx.response.callReturn[1])
        isEmptyTrade = unmatchedShares.eq(abi.bignum(p.max_amount))
      }
      if (isEmptyTrade) {
        return dispatch(deleteTransaction(`${hash}-${p.buyer_trade_id}`))
      }
      if (status === STATUSES.SUBMITTED) {
        dispatch(deleteTransaction(`${transactionHash}-${p.buyer_trade_id}`))
        dispatch(fillOrder({
          type: TYPES.BUY,
          market: order.market,
          tradeid: p.buyer_trade_id,
          sender: tx.data.from,
          owner: order.owner,
          amount,
          price: order.price,
          outcome: parseInt(order.outcome, 10)
        }))
      }
      return [dispatch(constructTradingTransaction(TYPES.LOG_SHORT_FILL_TX, {
        ...p,
        price: order.price,
        outcome: parseInt(order.outcome, 10),
        amount,
        sender: tx.data.from,
        owner: order.owner,
        tradeid: p.buyer_trade_id,
        tradeHash,
        takerFee: tradingFees,
        gasFees,
        isShortSell: true
      }, abi.format_int256(order.market), order.outcome, status))]
    }
    case TYPES.TRADE: {
      const { transactionHash, orders, tradeHash, tradingFees, maxValue, remainingShares, gasFees } = getState().tradeCommitment
      const { marketsData } = getState()
      const numTradeIDs = p.trade_ids.length
      const transactions = new Array(numTradeIDs)
      let remainingEth = abi.bignum(maxValue)
      let isEmptyTrade
      let notification
      if (status === STATUSES.SUCCESS) {
        let unmatchedCash = ZERO
        let unmatchedShares = ZERO
        if (tx.response.callReturn && Array.isArray(tx.response.callReturn)) {
          unmatchedCash = abi.unfix_signed(tx.response.callReturn[1])
          unmatchedShares = abi.unfix(tx.response.callReturn[2])
        }
        isEmptyTrade = unmatchedCash.eq(abi.unfix_signed(p.max_value)) && unmatchedShares.eq(abi.unfix(p.max_amount))
      }
      for (let i = 0; i < numTradeIDs; ++i) {
        const order = orders[i]
        let market = {}
        if (isEmptyTrade) {
          dispatch(deleteTransaction(`${hash}-${order.id}`))
        } else {
          let amount
          if (abi.bignum(remainingShares).gt(ZERO)) {
            if (abi.bignum(remainingShares).gt(abi.bignum(order.amount))) {
              amount = order.amount
            } else {
              amount = remainingShares
            }
          } else {
            market = marketsData[abi.format_int256(order.market)]
            let price
            if (market.type === SCALAR) {
              price = abi.bignum(augur.trading.shrinkScalarPrice(market.minValue, order.price))
            } else {
              price = abi.bignum(order.price)
            }
            amount = remainingEth.minus(abi.bignum(tradingFees)).dividedBy(price)
            if (amount.gt(abi.bignum(order.amount))) {
              amount = order.amount
            } else {
              amount = amount.toFixed()
            }
            remainingEth = remainingEth.minus(abi.bignum(amount).times(price))
          }
          if (status === STATUSES.SUBMITTED) {
            dispatch(deleteTransaction(`${transactionHash}-${order.id}`))
            dispatch(fillOrder({
              type: order.type === TYPES.BUY ? TYPES.SELL : TYPES.BUY,
              tradeid: order.id,
              sender: tx.data.from,
              owner: order.owner,
              market: order.market,
              amount,
              price: order.price,
              outcome: parseInt(order.outcome, 10)
            }))
          }

          notification = {
            id: p.transactionHash,
            title: `${order.type === TYPES.BUY ? TYPES.SELL : TYPES.BUY} ${amount || ''} ${amount && 'Share'}${amount && parseFloat(amount, 10) === 1 ? '' : 's'} - ${tx.status}`,
            description: market.description || '',
            timestamp: p.timestamp,
            linkPath: makePath(TRANSACTIONS)
          }
          transactions[i] = dispatch(constructTradingTransaction(TYPES.LOG_FILL_TX, {
            ...p,
            price: order.price,
            outcome: parseInt(order.outcome, 10),
            amount,
            sender: tx.data.from,
            owner: order.owner,
            type: order.type === TYPES.BUY ? TYPES.SELL : TYPES.BUY,
            tradeid: order.id,
            tradeHash,
            takerFee: tradingFees,
            gasFees
          }, abi.format_int256(order.market), order.outcome, status))
        }
      }
      dispatch(addNotification(notification))
      return transactions
    }
    default: {
      let transaction
      let notification
      switch (method) {
        case TYPES.WITHDRAW_ETHER: {
          const amount = abi.is_hex(p.value) ? parseFloat(p.value, 10) : abi.unfix(p.value).toNumber()

          notification = {
            id: p.transactionHash,
            title: `Convert ETH Token to ETH - ${tx.status}`,
            description: `Converting ${amount.toLocaleString()} ETH Token${amount === 1 ? '' : 's'} to ETH`,
            timestamp: p.timestamp,
            linkPath: makePath(TRANSACTIONS)
          }
          transaction = dispatch(constructTransaction(TYPES.WITHDRAW_ETHER, { ...p, ...tx }))
          break
        }
        case TYPES.DEPOSIT_ETHER: {
          const amount = abi.is_hex(tx.data.value) ? parseFloat(tx.data.value, 10) : abi.unfix(tx.data.value).toNumber()

          notification = {
            id: p.transactionHash,
            title: `Convert ETH to ETH Token - ${tx.status}`,
            description: `Converting ${amount.toLocaleString()} ETH to ETH Token${amount === 1 ? '' : 's'}`,
            timestamp: p.timestamp,
            linkPath: makePath(TRANSACTIONS)
          }
          transaction = dispatch(constructTransaction(TYPES.DEPOSIT_ETHER, { ...p, ...tx }))
          break
        }
        case 'fundNewAccount': {
          notification = {
            id: p.transactionHash,
            title: `Fund Account Request - ${tx.status}`,
            description: 'Requesting testnet ETH, ETH Tokens, and REP',
            timestamp: p.timestamp,
            linkPath: makePath(TRANSACTIONS)
          }
          transaction = dispatch(constructTransaction(TYPES.FUNDED_ACCOUNT, p))
          break
        }
        case 'slashRep':
          if (tx.data.from === loginAccount.address) {
            notification = {
              id: p.transactionHash,
              title: `Snitch Reward - ${tx.status}`,
              description: p.reporter,
              timestamp: p.timestamp,
              linkPath: makePath(TRANSACTIONS)
            }
          } else {
            notification = {
              id: p.transactionHash,
              title: `Pay Collusion Fine - ${tx.status}`,
              description: abi.strip_0x(tx.data.from),
              timestamp: p.timestamp,
              linkPath: makePath(TRANSACTIONS)
            }
          }
          transaction = dispatch(constructTransaction(TYPES.SLASHED_REP, {
            ...p,
            sender: tx.data.from
          }))
          break
        case 'submitReport': {
          const additionalInfo = dispatch(loadDataForReportingTransaction(TYPES.SUBMITTED_REPORT_HASH, { ...p }))
          notification = {
            id: p.transactionHash,
            title: `Reveal Report - ${tx.status}`,
            description: additionalInfo.market.description || '',
            timestamp: p.timestamp,
            linkPath: makePath(TRANSACTIONS)
          }
          transaction = dispatch(constructTransaction(TYPES.SUBMITTED_REPORT, {
            ...p, // { event, report, salt }
            ethics: parseInt(p.ethics, 16)
          }))
          break
        }
        case 'submitReportHash': {
          const additionalInfo = dispatch(loadDataForReportingTransaction(TYPES.SUBMITTED_REPORT_HASH, { ...p }))
          notification = {
            id: p.transactionHash,
            title: `Commit Report - ${tx.status}`,
            description: additionalInfo.market.description || '',
            timestamp: p.timestamp,
            linkPath: makePath(TRANSACTIONS)
          }
          transaction = dispatch(constructTransaction(TYPES.SUBMITTED_REPORT_HASH, {
            ...p, // { event, encryptedReport, encryptedSalt }
            ethics: parseInt(p.ethics, 16)
          }))
          break
        }
        case 'penalizeWrong': {
          const { eventsWithSubmittedReport } = getState()
          if (!parseInt(p.event, 16) || !eventsWithSubmittedReport || !eventsWithSubmittedReport[p.event]) {
            return null
          }
          const market = selectMarketFromEventID(p.event)
          if (!market) return null

          notification = {
            id: p.transactionHash,
            title: `Wrong Report Penalty - ${tx.status}`,
            description: `${p.repchange} REP`,
            timestamp: p.timestamp,
            linkPath: makePath(TRANSACTIONS)
          }
          transaction = dispatch(constructTransaction(TYPES.PENALIZE, {
            ...p, // { event }
            reportValue: eventsWithSubmittedReport[p.event].accountReport,
            outcome: market.reportedOutcome
          }))
          break
        }
        case 'penalizationCatchup': {
          const { lastPeriodPenalized, reportPeriod } = getState().branch
          notification = {
            id: p.transactionHash,
            title: `Missed Reports Penalty - ${tx.status}`,
            description: `${p.repLost} REP`,
            timestamp: p.timestamp,
            linkPath: makePath(TRANSACTIONS)
          }
          transaction = dispatch(constructTransaction(TYPES.PENALIZATION_CAUGHT_UP, {
            ...p,
            penalizedFrom: lastPeriodPenalized,
            penalizedUpTo: reportPeriod
          }))
          break
        }
        case 'collectFees': {
          const { branch, loginAccount } = getState()
          notification = {
            id: p.transactionHash,
            title: `Reporting Payout - ${tx.status}`,
            description: `${p.repGain} REP`,
            timestamp: p.timestamp,
            linkPath: makePath(TRANSACTIONS)
          }
          transaction = dispatch(constructTransaction(TYPES.COLLECTED_FEES, {
            ...p,
            initialRepBalance: loginAccount.rep,
            notReportingBond: abi.unfix(tx.data.value, 'string'),
            period: branch.lastPeriodPenalized
          }))
          break
        }
        case 'claimProceeds': {
          const { outcomesData, transactionsData } = getState()

          let shares
          if (transactionsData[hash] && transactionsData[hash].data.shares) {
            shares = transactionsData[hash].data.shares
          } else {
            const winningPositions = selectWinningPositions(outcomesData)
            shares = (winningPositions.find(position => position.id === abi.format_int256(p.market)) || {}).shares
          }

          notification = {
            id: p.transactionHash,
            title: `Claim Trading Payout - ${tx.status}`,
            description: `${shares} Shares`,
            timestamp: p.timestamp,
            linkPath: makePath(TRANSACTIONS)
          }
          transaction = dispatch(constructTransaction(TYPES.PAYOUT, { ...p, shares }))
          break
        }
        case 'send':
          notification = {
            id: p.transactionHash,
            title: `Send Ether Tokens - ${tx.status}`,
            description: `${abi.unfix(p.value, 'string')} ETH Tokens`,
            timestamp: p.timestamp,
            linkPath: makePath(TRANSACTIONS)
          }
          transaction = dispatch(constructTransaction(TYPES.SENT_CASH, {
            ...p,
            _from: abi.format_address(p.from),
            _to: abi.format_address(p.recver),
            _value: abi.unfix(p.value, 'string')
          }))
          break
        case 'sendEther':
          notification = {
            id: p.transactionHash,
            title: `Send Ether - ${tx.status}`,
            description: `${abi.unfix(p.value, 'string')} ETH`,
            timestamp: p.timestamp,
            linkPath: makePath(TRANSACTIONS)
          }
          transaction = dispatch(constructTransaction(TYPES.SENT_ETHER, {
            ...p,
            _from: abi.format_address(p.from),
            _to: abi.format_address(p.to),
            _value: abi.unfix(p.value, 'string')
          }))
          break
        case 'transfer':
        case 'sendReputation':
          notification = {
            id: p.transactionHash,
            title: `Transfer Reputation - ${tx.status}`,
            description: `${abi.unfix(p.value, 'string')} REP`,
            timestamp: p.timestamp,
            linkPath: makePath(TRANSACTIONS)
          }
          transaction = dispatch(constructTransaction(TYPES.TRANSFER, {
            ...p,
            _from: abi.format_address(tx.data.from),
            _to: abi.format_address(p.recver),
            _value: abi.unfix(p.value, 'string')
          }))
          break
        case 'approve':
          notification = {
            id: p.transactionHash,
            title: `Approve Spender - ${tx.status}`,
            description: abi.format_address(p.spender),
            timestamp: p.timestamp
          }
          transaction = dispatch(constructTransaction(TYPES.APPROVAL, {
            ...p,
            _spender: abi.format_address(p.spender)
          }))
          break
        case 'register':
          notification = {
            id: p.transactionHash,
            title: `Registration - ${tx.status}`,
            description: 'Logging account registration',
            timestamp: p.timestamp,
            linkPath: makePath(TRANSACTIONS)
          }
          transaction = dispatch(constructTransaction(TYPES.REGISTRATION, {
            ...p,
            sender: abi.format_address(tx.data.from)
          }))
          break
        case 'createMarket':
        case 'createSingleEventMarket': {
          notification = {
            id: p.transactionHash,
            title: `Create Market - ${tx.status}`,
            description: p.description,
            timestamp: p.timestamp,
            linkPath: makePath(TRANSACTIONS)
          }
          const { baseReporters, numEventsCreatedInPast24Hours, numEventsInReportPeriod, periodLength } = getState().branch
          transaction = dispatch(constructTransaction(TYPES.MARKET_CREATED, {
            ...p,
            eventBond: augur.create.calculateValidityBond(p.tradingFee, periodLength, baseReporters, numEventsCreatedInPast24Hours, numEventsInReportPeriod),
            marketCreationFee: abi.unfix(augur.create.calculateRequiredMarketValue(gasPrice), 'string')
          }))
          break
        }
        default:
          return null
      }
      dispatch(addNotification(notification))
      return {
        [hash]: {
          ...dispatch(constructBasicTransaction(hash, status, p.blockNumber, p.timestamp, gasFees)),
          ...transaction
        }
      }
    }
  }
}
