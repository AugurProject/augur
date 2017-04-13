import { connect } from 'react-redux';
import memoize from 'memoizee';

import MyPositions from 'modules/my-positions/components/my-positions';

import getLoginAccountPositions from 'modules/my-positions/selectors/login-account-positions';
import getOpenOrders from 'modules/user-open-orders/selectors/open-orders';
import getClosePositionStatus from 'modules/my-positions/selectors/close-position-status';
import getScalarShareDenomination from 'modules/market/selectors/scalar-share-denomination';
import getOrderCancellation from 'modules/bids-asks/selectors/order-cancellation';

const mapStateToProps = (state) => {
  const positions = getLoginAccountPositions();
  const openOrders = getOpenOrders();
  //
  // console.log('positions -- ', positions, openOrders);
  //
  // console.log('getPositionsMarkets -- ', getPositionsMarkets(positions, openOrders));

  return {
    markets: getPositionsMarkets(positions, openOrders),
    isTradeCommitLocked: state.tradeCommitLock.isLocked,
    closePositionStatus: getClosePositionStatus(),
    scalarShareDenomination: getScalarShareDenomination(),
    orderCancellation: getOrderCancellation()
  };
};

const MyPositionsContainer = connect(mapStateToProps)(MyPositions);

const getPositionsMarkets = memoize((positions, openOrders) => Array.from(new Set([...positions.markets, ...openOrders])), { max: 1 });

export default MyPositionsContainer;
