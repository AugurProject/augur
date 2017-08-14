import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MarketView from 'modules/market/components/market-view';

import { selectTradeCommitLockIsLocked } from 'src/select-state';
import { selectSelectedMarket } from 'modules/market/selectors/market';
import { selectMarketsTotals } from 'modules/markets/selectors/markets-totals';
import { selectClosePositionStatus } from 'modules/my-positions/selectors/close-position-status';
import getScalarShareDenomination from 'modules/market/selectors/scalar-share-denomination';
import getOrderCancellation from 'modules/bids-asks/selectors/order-cancellation';

import { loadFullMarket } from 'modules/market/actions/load-full-market';
import { updateSelectedMarketID, clearSelectedMarketID } from 'modules/market/actions/update-selected-market-id';

import { MARKET_USER_DATA_NAV_ITEMS } from 'modules/market/constants/market-user-data-nav-items';
import { MARKET_DATA_NAV_ITEMS } from 'modules/market/constants/market-data-nav-items';
import { OUTCOME_TRADE_NAV_ITEMS } from 'modules/outcomes/constants/outcome-trade-nav-items';

import getValue from 'utils/get-value';

const mapStateToProps = state => ({
  isConnected: state.connection.isConnected,
  isLogged: !!getValue(state, 'loginAccount.address'),
  market: selectSelectedMarket(state),
  orderCancellation: getOrderCancellation(),
  numPendingReports: selectMarketsTotals(state).numPendingReports,
  isTradeCommitLocked: selectTradeCommitLockIsLocked(state),
  scalarShareDenomination: getScalarShareDenomination(),
  closePositionStatus: selectClosePositionStatus(state),
  marketDataNavItems: MARKET_DATA_NAV_ITEMS,
  marketUserDataNavItems: MARKET_USER_DATA_NAV_ITEMS,
  outcomeTradeNavItems: OUTCOME_TRADE_NAV_ITEMS,
  branch: state.branch
});

const mapDispatchToProps = dispatch => ({
  loadFullMarket: marketId => dispatch(loadFullMarket(marketId)),
  updateSelectedMarketID: marketId => dispatch(updateSelectedMarketID(marketId)),
  clearSelectedMarketID: () => dispatch(clearSelectedMarketID())
});

const Market = withRouter(connect(mapStateToProps, mapDispatchToProps)(MarketView));

export default Market;
