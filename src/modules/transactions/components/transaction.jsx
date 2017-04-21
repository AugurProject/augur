import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import TransactionDetails from 'modules/transactions/components/transaction-details';
import TransactionSummary from 'modules/transactions/components/transaction-summary';
import Spinner from 'modules/common/components/spinner';

import { SUCCESS, FAILED, INTERRUPTED } from 'modules/transactions/constants/statuses';

export default class Transaction extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
    transactionIndex: PropTypes.number.isRequired,
    isGroupedTransaction: PropTypes.bool
  }

  constructor(props) {
    super(props);

    this.state = {
      isFullTransactionVisible: false
    };
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <article className="transaction">
        <span className={classNames('transaction-index', p.status, p.isGroupedTransaction && 'transaction-grouped')}>
          {p.status === SUCCESS || p.status === FAILED || p.status === INTERRUPTED ?
            p.transactionIndex :
            <Spinner />
          }
        </span>
        <div className="transaction-content" >
          <div className={classNames('transaction-content-main', s.isFullTransactionVisible && 'transaction-details-visible')}>
            <TransactionSummary
              isGroupedTransaction={p.isGroupedTransaction}
              {...p}
            />
            <button
              className="unstyled transaction-toggle"
              onClick={() => this.setState({ isFullTransactionVisible: !s.isFullTransactionVisible })}
            >
              {s.isFullTransactionVisible ?
                <i className="fa fa-minus" /> :
                <i className="fa fa-plus" />
              }
            </button>
          </div>
          <TransactionDetails
            isVisible={s.isFullTransactionVisible}
            {...p}
          />
        </div>
      </article>
    );
  }
}
