import React from 'react';
import classNames from 'classnames';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

import Transaction from 'modules/transactions/components/transaction';

const TransactionGroup = p => (
  <article className={classNames('transaction-group', p.status)} >
    <div className={classNames('transaction-group-summary', p.status)}>
      <span className="transaction-action">{p.message}</span>
      <span className="transaction-group-summary-description">{p.description}</span>
    </div>
    <CSSTransitionGroup
      transitionName="transaction"
      transitionAppear
      transitionAppearTimeout={1200}
      transitionEnterTimeout={1200}
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
    </CSSTransitionGroup>
  </article>
);

export default TransactionGroup;
