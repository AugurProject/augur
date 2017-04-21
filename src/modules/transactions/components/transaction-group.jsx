import React from 'react';

import Transaction from 'modules/transactions/components/transaction';

const TransactionGroup = p => (
  <article className="transaction-group">
    <span>Grouped Transactions</span>
    {p.transactions.map((transaction, i) => (
      <Transaction
        key={transaction.id}
        currentBlockNumber={p.currentBlockNumber}
        {...transaction}
      />
    ))}
  </article>
);

export default TransactionGroup;
