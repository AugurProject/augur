import { connect } from 'react-redux';
import MarketView from 'modules/market/components/market-view';

import { selectSelectedMarket } from 'modules/market/selectors/market';
import getMarketsTotals from 'modules/markets/selectors/markets-totals';
import getClosePositionStatus from 'modules/my-positions/selectors/close-position-status';
import getScalarShareDenomination from 'modules/market/selectors/scalar-share-denomination';
import getOrderCancellation from 'modules/bids-asks/selectors/order-cancellation';

import { MARKET_USER_DATA_NAV_ITEMS } from 'modules/market/constants/market-user-data-nav-items';
import { MARKET_DATA_NAV_ITEMS } from 'modules/market/constants/market-data-nav-items';
import { OUTCOME_TRADE_NAV_ITEMS } from 'modules/outcomes/constants/outcome-trade-nav-items';

import getValue from 'utils/get-value';

const mapStateToProps = state => ({
  logged: getValue(state, 'loginAccount.address'),
  // market: selectSelectedMarket(state),
  orderCancellation: getOrderCancellation(),
  numPendingReports: getMarketsTotals().numPendingReports,
  isTradeCommitLocked: state.tradeCommitLock.isLocked,
  scalarShareDenomination: getScalarShareDenomination(),
  marketDataNavItems: MARKET_DATA_NAV_ITEMS,
  marketUserDataNavItems: MARKET_USER_DATA_NAV_ITEMS,
  outcomeTradeNavItems: OUTCOME_TRADE_NAV_ITEMS,
  closePositionStatus: getClosePositionStatus(),
  branch: state.branch,
});

const Market = connect(mapStateToProps)(MarketView);

export default Market;
