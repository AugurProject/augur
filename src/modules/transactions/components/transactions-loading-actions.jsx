import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Spinner from 'modules/common/components/spinner/spinner'

const TransactionsLoadingActions = p => (
  <article className="transactions-loading-actions">
    {!p.transactionsLoading && !p.hasAllTransactionsLoaded &&
      <div className="transactions-load-buttons">
        <button
          className={classNames('unstyled', { disabled: true })}
          onClick={() => {
            if (!p.transactionsLoading) p.loadMoreTransactions()
          }}
        >
          <span>Load More</span>
        </button>
        <button
          className={classNames('unstyled', { disabled: true })}
          onClick={() => {
            if (!p.transactionsLoading) p.loadAllTransactions()
          }}
        >
          <span>Load All</span>
        </button>
        <button
          className={classNames('unstyled', { disabled: true }, { hidden: !p.allowExport })}
          onClick={() => {
            if (!p.transactionsLoading) {
              p.triggerTransactionsExport()
            }
          }}
        >
          <span>Export All</span>
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
      <button
        className={classNames('unstyled', { disabled: p.transactionsLoading }, { hidden: !p.allowExport })}
        onClick={() => {
          p.triggerTransactionsExport()
        }}
      >
        <span>Export All</span>
      </button>
    </div>
    }
  </article>
)

TransactionsLoadingActions.propTypes = {
  loadMoreTransactions: PropTypes.func.isRequired,
  loadAllTransactions: PropTypes.func.isRequired,
  triggerTransactionsExport: PropTypes.func.isRequired,
  transactionsLoading: PropTypes.bool,
  hasAllTransactionsLoaded: PropTypes.bool,
  allowExport: PropTypes.bool,
}

export default TransactionsLoadingActions
