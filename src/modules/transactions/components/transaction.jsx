import React, { Component, PropTypes } from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import classNames from 'classnames';
import TransactionDetails from 'modules/transactions/components/transaction-details';
import TransactionSummary from 'modules/transactions/components/transaction-summary';
import Spinner from 'modules/common/components/spinner';

import { SUBMITTED, PENDING, COMMITTING } from 'modules/transactions/constants/statuses';

export default class Transaction extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
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

    const animationSpeed = parseInt(window.getComputedStyle(document.body).getPropertyValue('--animation-speed-fast'), 10);

    return (
      <article className={classNames('transaction', p.status)}>
        <span className={classNames('transaction-status', p.status)} />
        <div className="transaction-content" >
          <div className={classNames('transaction-content-main', s.isFullTransactionVisible && 'transaction-details-visible')}>
            <TransactionSummary
              isGroupedTransaction={p.isGroupedTransaction}
              {...p}
            />
            <span className="transaction-spinner">
              {(p.status === SUBMITTED || p.status === PENDING || p.status === COMMITTING) &&
                <Spinner />
              }
            </span>
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
          <CSSTransitionGroup
            transitionName="transaction"
            transitionEnterTimeout={animationSpeed}
            transitionLeaveTimeout={animationSpeed}
          >
            {s.isFullTransactionVisible &&
              <TransactionDetails
                {...p}
              />
            }
          </CSSTransitionGroup>
        </div>
      </article>
    );
  }
}
