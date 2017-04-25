import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Transactions from 'modules/transactions/components/transactions';
import Branch from 'modules/branch/components/branch';
import Paginator from 'modules/common/components/paginator';
import Spinner from 'modules/common/components/spinner';

import getValue from 'utils/get-value';

export default class TransactionsView extends Component {
  static propTypes = {
    branch: PropTypes.object,
    currentBlockNumber: PropTypes.number,
    loginAccount: PropTypes.object,
    transactions: PropTypes.array.isRequired,
    transactionsLoading: PropTypes.bool.isRequired,
    loadMoreTransactions: PropTypes.func.isRequired,
    loadAllTransactions: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      transactionsPerPage: 50, // -- Update this value to change pagination size
      nullMessage: 'No Transaction Data',
      lowerIndex: null,
      upperIndex: null,
      currentPage: 1,
      pagination: {},
      paginatedTransactions: []
    };

    this.updatePagination = this.updatePagination.bind(this);
    this.paginateTransactions = this.paginateTransactions.bind(this);
  }

  componentWillMount() {
    this.updatePagination(this.props, this.state);
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      this.props.transactions !== nextProps.transactions ||
      this.state.currentPage !== nextState.currentPage
    ) {
      this.updatePagination(nextProps, nextState, this.state.currentPage < nextState.currentPage);
    }
  }

  updatePagination(p, s) {
    const itemsPerPage = s.transactionsPerPage - 1; // Convert to zero index
    const lowerIndex = (s.currentPage - 1) * s.transactionsPerPage;
    const upperIndex = (p.transactions.length - 1) > lowerIndex + itemsPerPage ?
      lowerIndex + itemsPerPage :
      p.transactions.length - 1;

    this.setState({
      lowerIndex,
      upperIndex,
      pagination: {
        numUnpaginated: p.transactions.length,
        startItemNum: lowerIndex + 1,
        endItemNum: upperIndex + 1,
        previousPageLink: s.currentPage > 1 ?
        {
          onClick: () => {
            if (s.currentPage > 1) this.setState({ currentPage: s.currentPage - 1 });
          }
        } :
        null,
        nextPageLink: s.currentPage < Math.ceil(p.transactions.length / s.transactionsPerPage) ?
        {
          onClick: () => {
            if (upperIndex < p.transactions.length - 1) this.setState({ currentPage: s.currentPage + 1 });
          }
        } :
        null
      }
    }, () => {
      this.paginateTransactions(this.props, this.state);
    });
  }

  paginateTransactions(p, s) {
    // Filter Based on Pagination
    const paginatedTransactions = p.transactions.slice(s.lowerIndex, s.upperIndex + 1);

    if (paginatedTransactions !== s.paginatedTransactions) {
      this.setState({ paginatedTransactions });
    }
  }

  render() {
    const p = this.props;
    const s = this.state;
    const transactionsListRef = this.transactionsList;

    const hasRep = !!getValue(p, 'loginAccount.rep.value');
    const hasBranch = !!getValue(p, 'branch.id');

    return (
      <section id="transactions_view">
        {hasRep && hasBranch &&
          <Branch {...p.branch} />
        }

        <div className="view-header">
          <div className="view-header-group">
            <h2>Transactions</h2>
          </div>
          <div className="view-header-group">
            {p.transactionsLoading &&
              <div className="transactions-loading-spinner" >
                <Spinner />
              </div>
            }
            {!p.transactionsLoading && !p.hasAllTransactionsLoaded &&
              <div className="transactions-load-buttons">
                <button
                  className="unstyled"
                  onClick={() => p.loadMoreTransactions()}
                >
                  <span>Load More</span>
                </button>
                <button
                  className="unstyled"
                  onClick={() => p.loadAllTransactions()}
                >
                  <span>Load All</span>
                </button>
              </div>
            }
            {!p.transactionsLoading && p.hasAllTransactionsLoaded &&
              <span
                className="transactions-all-loaded-message"
              >
                All Transactions Loaded
              </span>
            }

          </div>
        </div>

        <div
          ref={(transactionsList) => { this.transactionsList = transactionsList; }}
        >
          <Transactions
            paginatedTransactions={s.paginatedTransactions}
            currentBlockNumber={p.currentBlockNumber}
          />
        </div>
        {!!p.transactions.length &&
          <Paginator
            {...s.pagination}
            isMobile={p.isMobile}
            scrollList={transactionsListRef}
          />
        }
      </section>
    );
  }
}
