import React from 'react';

import Transaction from 'modules/transactions/components/transaction';

const TransactionGroup = p => (
  <article className="transaction-group">
    <div className="transaction-group-summary">
      <span>Grouped Transactions</span>
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
