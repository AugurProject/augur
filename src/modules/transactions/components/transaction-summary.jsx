import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import ValueDenomination from 'modules/common/components/value-denomination/value-denomination'
import ValueTimestamp from 'modules/common/components/value-timestamp'

import { CREATE_MARKET, BUY, SELL, BID, ASK, MATCH_BID, MATCH_ASK, SUBMIT_REPORT, CANCEL_ORDER, SELL_COMPLETE_SETS } from 'modules/transactions/constants/types'
import { FUND_ACCOUNT } from 'modules/auth/constants/auth-types'
import { SCALAR, CATEGORICAL } from 'modules/markets/constants/market-types'

import makePath from 'modules/app/helpers/make-path'
import makeQuery from 'modules/app/helpers/make-query'

import getValue from 'utils/get-value'

import { MARKET } from 'modules/app/constants/views'
import { MARKET_ID_PARAM_NAME } from 'modules/app/constants/param-names'

const TransactionSummary = p => (
  <article className={classNames('transaction-summary', p.isGroupedTransaction && 'transaction-grouped')}>
    {p.data.marketID ?
      <Link
        to={{
          pathname: makePath(MARKET),
          search: makeQuery({
            [MARKET_ID_PARAM_NAME]: p.data.marketID
          })
        }}
      >
        <TransactionSummaryContent {...p} />
      </Link> :
      <TransactionSummaryContent {...p} />
    }
  </article>
)

const TransactionSummaryContent = p => (
  <div className="transaction-summary-content">
    <div className="transaction-action">
      {transactionAction(p)}
      {transactionActionDetails(p)}
    </div>
    <div className="transaction-description">
      <span>{transactionDescription(p)}</span>
    </div>
    <ValueTimestamp
      className="transaction-timestamp"
      {...p.timestamp}
    />
  </div>
)

function transactionAction(transaction) {
  const action = () => {
    switch (transaction.type) {
      case BUY:
        return 'Buy '
      case BID:
        return 'Bid '
      case SELL:
        return 'Sell '
      case ASK:
        return 'Ask '
      case MATCH_BID:
        return 'Bid Filled '
      case MATCH_ASK:
        return 'Ask Filled '
      case CANCEL_ORDER:
        return 'Cancel Order '
      case SELL_COMPLETE_SETS:
        return `Redeem ${transaction.numShares.formatted} Complete Sets `
      case CREATE_MARKET:
        return 'Create Market '
      case SUBMIT_REPORT:
        return 'Submit Report '
      default:
        return transaction.type
    }
  }

  return <span className="transaction-action-type">{action()}</span>
}

function transactionActionDetails(transaction) {
  switch (transaction.type) {
    case BUY:
    case BID:
    case SELL:
    case ASK:
    case MATCH_BID:
    case MATCH_ASK: {
      return (
        <div className="transaction-trade-action-details">
          <ValueDenomination
            className="transaction-shares"
            {...transaction.numShares}
          />
          {transaction.data.marketType === CATEGORICAL &&
            <span>
              <span className="short-word"> of </span><span className="outcome-name">{transaction.data.outcomeName && transaction.data.outcomeName.toString().substring(0, 35) + ((transaction.data.outcomeName.toString().length > 35 && '...') || '')}</span>
            </span>
          }
          <span className="at"> @ </span>
          <ValueDenomination className="noFeePrice" {...transaction.noFeePrice} />
        </div>
      )
    }
    case CANCEL_ORDER: {
      return (
        <div className="transaction-trade-action-details">
          <span className="short-word">to</span>
          <span> {transaction.data.order.type} </span>
          <ValueDenomination {...transaction.data.order.shares} />
          <span className="short-word"> of </span>
          <span className="outcome-name">{transaction.data.outcome.name && transaction.data.outcome.name.substring(0, 35) + ((transaction.data.outcome.name.length > 35 && '...') || '')}</span>
        </div>
      )
    }
    case SUBMIT_REPORT: {
      const type = getValue(transaction, 'data.market.type')
      const outcomeName = getValue(transaction, 'data.outcome.name')
      const reportedOutcome = (transaction.data.isScalar || type === SCALAR) ?
        transaction.data.reportedOutcomeID :
        outcomeName && `${outcomeName.substring(0, 35)}${outcomeName.length > 35 && '...'}`

      return (
        <div className="transaction-trade-action-report-details">
          {!!reportedOutcome &&
            <span className="transaction-reported-outcome">{reportedOutcome}</span>
          }
        </div>
      )
    }
    default:
      break
  }
}

function transactionDescription(transaction) {
  switch (transaction.type) {
    case FUND_ACCOUNT:
      return 'Request testnet Ether and Reputation'
    default:
      return transaction.description
  }
}

TransactionSummary.propTypes = {
  type: PropTypes.string.isRequired
}

export default TransactionSummary
