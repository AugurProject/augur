import React from 'react';
import Transaction from 'modules/transactions/components/transaction';
import TransactionGroup from 'modules/transactions/components/transaction-group';
import NullStateMessage from 'modules/common/components/null-state-message';

const Transactions = p => (
  <article className="transactions">
    {p.transactions.length ?
      <div>
        {p.transactions.map((transaction, i) => (
            transaction.transactions && transaction.transactions.length > 1 ?
              <TransactionGroup
                key={transaction.timestamp}
                currentBlockNumber={p.currentBlockNumber}
                {...transaction}
              /> :
              <Transaction
                key={transaction.id}
                currentBlockNumber={p.currentBlockNumber}
                {...transaction}
              />
        ))}
      </div> :
      <NullStateMessage
        message="No Transaction Data"
      />
    }
  </article>
);

Transactions.propTypes = {
  className: React.PropTypes.string,
  transactions: React.PropTypes.array,
  currentBlockNumber: React.PropTypes.number
};

export default Transactions;
