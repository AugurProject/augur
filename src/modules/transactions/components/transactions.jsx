import React from 'react'
import PropTypes from 'prop-types'
import { TransitionGroup } from 'react-transition-group'
import Transaction from 'modules/transactions/components/transaction'
import TransactionGroup from 'modules/transactions/components/transaction-group'
import NullStateMessage from 'modules/common/components/null-state-message'

const Transactions = (p) => {
  const animationSpeed = parseInt(window.getComputedStyle(document.body).getPropertyValue('--animation-speed-very-slow'), 10)

  return (
    <article className="transactions">
      {p.boundedLength && p.transactions.length ?
        <TransitionGroup
          transitionName="transaction"
          transitionEnter={!p.pageChanged}
          transitionEnterTimeout={animationSpeed}
          transitionLeave={false}
        >
          {[...Array(p.boundedLength)].map((unused, i) => {
            const transaction = p.transactions[(p.lowerBound - 1) + i]

            return (
              transaction.transactions && transaction.transactions.length > 1 ?
                <TransactionGroup
                  key={transaction.transactions[0].hash}
                  currentBlockNumber={p.currentBlockNumber}
                  {...transaction}
                /> :
                <Transaction
                  key={transaction.hash}
                  currentBlockNumber={p.currentBlockNumber}
                  {...transaction}
                />
            )
          })}
        </TransitionGroup> :
        <NullStateMessage
          message="No Transaction Data"
        />
      }
    </article>
  )
}

Transactions.propTypes = {
  lowerBound: PropTypes.any,
  boundedLength: PropTypes.any,
  pageChanged: PropTypes.bool.isRequired,
  className: PropTypes.string,
  transactions: PropTypes.array,
  currentBlockNumber: PropTypes.number
}

export default Transactions
