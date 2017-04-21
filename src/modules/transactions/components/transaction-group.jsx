import React from 'react';
import classNames from 'classnames';

import Transaction from 'modules/transactions/components/transaction';

const TransactionGroup = p => (
  <article className="transaction-group">
    <div className={classNames('transaction-group-summary', p.status)}>
      <span className="transaction-action">{p.message}</span>
      <span className="transaction-group-summary-description">{p.description}</span>
    </div>
    {p.transactions.map((transaction, i) => (
      <Transaction
        key={transaction.id}
        currentBlockNumber={p.currentBlockNumber}
        isGroupedTransaction
        {...transaction}
      />
    ))}
  </article>
);

export default TransactionGroup;
