import React, { PropTypes } from 'react';
import classnames from 'classnames';
import TransactionDetails from 'modules/transactions/components/transaction-details';
import TransactionSummary from 'modules/transactions/components/transaction-summary';

const Transaction = p => (
  <article className={classnames('transaction', p.status)}>
    <span className="transaction-index">{p.transactionIndex}</span>
    <TransactionSummary {...p} />
    <TransactionDetails {...p} />
  </article>
);

Transaction.propTypes = {
  status: PropTypes.string.isRequired,
  transactionIndex: PropTypes.number.isRequired
};

export default Transaction;
