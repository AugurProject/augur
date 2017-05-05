import { connect } from 'react-redux';
import memoize from 'memoizee';

import MyPositions from 'modules/my-positions/components/my-positions';

import getLoginAccountPositions from 'modules/my-positions/selectors/login-account-positions';
import getOpenOrders from 'modules/user-open-orders/selectors/open-orders';
import getClosePositionStatus from 'modules/my-positions/selectors/close-position-status';
import getScalarShareDenomination from 'modules/market/selectors/scalar-share-denomination';
import getOrderCancellation from 'modules/bids-asks/selectors/order-cancellation';
import { loadAccountHistory } from 'modules/auth/actions/load-account-history';

const mapStateToProps = (state) => {
  const positions = getLoginAccountPositions();
  const openOrders = getOpenOrders();

  return {
    markets: getPositionsMarkets(positions, openOrders),
    isTradeCommitLocked: state.tradeCommitLock.isLocked,
    closePositionStatus: getClosePositionStatus(),
    scalarShareDenomination: getScalarShareDenomination(),
    orderCancellation: getOrderCancellation(),
    transactionsLoading: state.transactionsLoading,
    hasAllTransactionsLoaded: state.transactionsOldestLoadedBlock === state.loginAccount.registerBlockNumber
  };
};

const mapDispatchToProps = dispatch => ({
  loadMoreTransactions: () => dispatch(loadAccountHistory()),
  loadAllTransactions: () => dispatch(loadAccountHistory(true))
});

const MyPositionsContainer = connect(mapStateToProps, mapDispatchToProps)(MyPositions);

const getPositionsMarkets = memoize((positions, openOrders) => Array.from(new Set([...positions.markets, ...openOrders])), { max: 1 });

export default MyPositionsContainer;
