import React from 'react'
import classNames from 'classnames'
import { TransitionGroup } from 'react-transition-group'

import Transaction from 'modules/transactions/components/transaction'

const TransactionGroup = (p) => {
  const animationInSpeed = parseInt(window.getComputedStyle(document.body).getPropertyValue('--animation-speed-very-slow'), 10)

  return (
    <article className={classNames('transaction-group', p.status)} >
      <div className={classNames('transaction-group-summary', p.status)}>
        <span className="transaction-action">{p.message}</span>
        <span className="transaction-group-summary-description">{p.description}</span>
      </div>
      <TransitionGroup
        transitionName="transaction"
        transitionEnterTimeout={animationInSpeed}
        transitionLeave={false}
      >
        {p.transactions.map((transaction, i) => (
          <Transaction
            key={transaction.id}
            currentBlockNumber={p.currentBlockNumber}
            isGroupedTransaction
            {...transaction}
          />
        ))}
      </TransitionGroup>
    </article>
  )
}

export default TransactionGroup
