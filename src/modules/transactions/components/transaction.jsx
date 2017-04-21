import React, { PropTypes } from 'react';
import classnames from 'classnames';
import TransactionDetails from 'modules/transactions/components/transaction-details';
import TransactionSummary from 'modules/transactions/components/transaction-summary';
import Spinner from 'modules/common/components/spinner';

import { SUCCESS, FAILED } from 'modules/transactions/constants/statuses';

const Transaction = p => (
  <article className={classnames('transaction', p.status)}>
    <span className="transaction-index">
      {p.status === SUCCESS || p.status === FAILED ?
        p.transactionIndex :
        <Spinner />
      }
    </span>
    <div className="transaction-main">
      <TransactionSummary {...p} />
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
  transactionIndex: PropTypes.number.isRequired
};

export default Transaction;
