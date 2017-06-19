import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Transactions from 'modules/transactions/components/transactions';
import Branch from 'modules/branch/components/branch';
import Paginator from 'modules/common/components/paginator';
import Spinner from 'modules/common/components/spinner';
import TransactionsLoadingActions from 'modules/transactions/components/transactions-loading-actions';

import getValue from 'utils/get-value';
import debounce from 'utils/debounce';

export default class TransactionsView extends Component {
  static propTypes = {
    branch: PropTypes.object,
    currentBlockNumber: PropTypes.number,
    loginAccount: PropTypes.object,
    transactions: PropTypes.array.isRequired,
    transactionsLoading: PropTypes.bool.isRequired,
    loadMoreTransactions: PropTypes.func.isRequired,
    loadAllTransactions: PropTypes.func.isRequired,
    isMobile: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      transactionsPerPage: 20, // -- Update this value to change pagination size
      nullMessage: 'No Transaction Data',
      lowerIndex: null,
      upperIndex: null,
      currentPage: 1,
      pageChanged: false,
      pagination: {},
      paginatedTransactions: [],
      hasAttachedScrollListener: false
    };

    this.updatePagination = this.updatePagination.bind(this);
    this.paginateTransactions = this.paginateTransactions.bind(this);
    this.handleScroll = debounce(this.handleScroll.bind(this), 100);
  }

  componentWillMount() {
    this.updatePagination(this.props, this.state);
  }

  componentDidMount() {
    this.manageScrollEventListener(this.props, this.state);
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      this.props.transactions !== nextProps.transactions ||
      this.state.currentPage !== nextState.currentPage
    ) {
      this.updatePagination(nextProps, nextState, this.state.currentPage !== nextState.currentPage);
    }

    // This is to prevent the CSSTransitionGroup from transitioning transactions on pagination
    if (this.state.pageChanged !== nextState.pageChanged) this.setState({ pageChanged: false });

    if (!nextState.hasAttachedScrollListener && nextProps.isMobile) this.setState({ hasAttachedScrollListener: true });
    if (nextState.hasAttachedScrollListener && !nextProps.isMobile) this.setState({ hasAttachedScrollListener: false });
  }

  componentDidUpdate(prevProps, prevState) {
    this.manageScrollEventListener(this.props, this.state);
  }

  componentWillUnmount() {
    if (this.state.hasAttachedScrollListener) window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    const D = document;
    const documentHeight = Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
    ); // Cross Browser Compatibility
    const currentScrollPosition = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight;

    if (documentHeight - currentScrollPosition < 200 && !this.props.transactionsLoading) {
      this.props.loadMoreTransactions();
    }
  }

  manageScrollEventListener(p, s) {
    if (p.isMobile && !s.hasAttachedScrollListener) {
      window.addEventListener('scroll', this.handleScroll);
      this.setState({ hasAttachedScrollListener: true });
    } else if (!p.isMobile && s.hasAttachedScrollListener) {
      window.removeEventListener('scroll', this.handleScroll);
      this.setState({ hasAttachedScrollListener: false });
    }
  }

  updatePagination(p, s, pageChanged = false) {
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
      this.paginateTransactions(this.props, this.state, pageChanged);
    });
  }

  paginateTransactions(p, s, pageChanged) {
    // Filter Based on Pagination
    const paginatedTransactions = p.transactions.slice(s.lowerIndex, s.upperIndex + 1);

    if (paginatedTransactions !== s.paginatedTransactions) {
      this.setState({
        paginatedTransactions,
        pageChanged
      });
    }
  }

  render() {
    const p = this.props;
    const s = this.state;

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
            <TransactionsLoadingActions
              loadMoreTransactions={p.loadMoreTransactions}
              loadAllTransactions={p.loadAllTransactions}
              transactionsLoading={p.transactionsLoading}
              hasAllTransactionsLoaded={p.hasAllTransactionsLoaded}
            />
          </div>
        </div>

        <Transactions
          transactions={p.isMobile ? p.transactions : s.paginatedTransactions}
          currentBlockNumber={p.currentBlockNumber}
          pageChanged={s.pageChanged}
        />

        {!!p.transactions.length && !p.isMobile &&
          <Paginator {...s.pagination} />
        }

        {p.isMobile &&
          <div className="transactions-loading-status">
            {p.isMobile && p.transactionsLoading &&
              <div className="transactions-loading-spinner" >
                <Spinner />
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
        }
      </section>
    );
  }
}
