import React, { PropTypes } from 'react';
import classNames from 'classnames';
import TransactionDetails from 'modules/transactions/components/transaction-details';
import TransactionSummary from 'modules/transactions/components/transaction-summary';
import Spinner from 'modules/common/components/spinner';

import { SUCCESS, FAILED, INTERRUPTED } from 'modules/transactions/constants/statuses';

const Transaction = p => (
  <article className="transaction">
    <span className={classNames('transaction-index', p.status, p.isGroupedTransaction && 'transaction-grouped')}>
      {p.status === SUCCESS || p.status === FAILED || p.status === INTERRUPTED ?
        p.transactionIndex :
        <Spinner />
      }
    </span>
    <div className="transaction-main" >
      <TransactionSummary
        isGroupedTransaction={p.isGroupedTransaction}
        {...p}
      />
      <button
        className="unstyled transaction-toggle"
      >
        <i className="fa fa-plus" />
      </button>
    </div>
    <TransactionDetails {...p} />
  </article>
);

Transaction.propTypes = {
  status: PropTypes.string.isRequired,
  transactionIndex: PropTypes.number.isRequired,
  isGroupedTransaction: PropTypes.bool
};

export default Transaction;
