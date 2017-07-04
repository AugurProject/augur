import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Spinner from 'modules/common/components/spinner';

export default class TransactionsLoadingActions extends Component {
  static propTypes = {
    loadMoreTransactions: PropTypes.func.isRequired,
    loadAllTransactions: PropTypes.func.isRequired,
    transactionsLoading: PropTypes.bool,
    hasAllTransactionsLoaded: PropTypes.bool
  };

  componentDidUpdate() {
    const p = this.props;
    if (p.exportTransactions && !p.transactionsLoading && p.hasAllTransactionsLoaded) {
      this.exportLink.click();
    }
  }

  render() {
    const p = this.props;

    return (
      <article className="transactions-loading-actions">
        {!p.transactionsLoading && !p.hasAllTransactionsLoaded &&
          <div className="transactions-load-buttons">
            <button
              className={classNames('unstyled', { disabled: p.transactionsLoading })}
              onClick={() => {
                if (!p.transactionsLoading) p.loadMoreTransactions();
              }}
            >
              <span>Load More</span>
            </button>
            <button
              className={classNames('unstyled', { disabled: p.transactionsLoading })}
              onClick={() => {
                if (!p.transactionsLoading) p.loadAllTransactions();
              }}
            >
              <span>Load All</span>
            </button>
            <button
              className={classNames('unstyled', { disabled: p.transactionsLoading })}
              onClick={() => {
                if (!p.transactionsLoading) {
                  p.loadAllTransactions();
                  p.toggleExportTransactions(true);
                }
              }}
            >
              <span>Export All Transactions</span>
            </button>
          </div>
        }
        {p.transactionsLoading &&
          <div className="transactions-loading-spinner" >
            <span className="transactions-loading-message">Loading More History</span>
            <Spinner />
          </div>
        }
        {!p.transactionsLoading && p.hasAllTransactionsLoaded && <div className="transactions-loaded">
          <span
            className="transactions-all-loaded-message"
          >
            All History Loaded
          </span>
          <a
            className={classNames('unstyled', { disabled: p.transactionsLoading })}
            ref={(exportLink) => { this.exportLink = exportLink; }}
            href={p.transactionsDataString}
            download="exported-transactions.json"
            onClick={() => {
              p.toggleExportTransactions(false);
            }}
          >
            <span>Export All Transactions</span>
          </a>
        </div>
        }
      </article>
    );
  }
}
