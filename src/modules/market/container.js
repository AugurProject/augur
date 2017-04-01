import { connect } from 'react-redux';
import MarketView from 'modules/market/components/market-view';

import { selectSelectedMarket } from 'modules/market/selectors/market';
import { selectMarketsTotals } from 'modules/markets/selectors/markets-totals';
import { selectClosePositionStatus } from 'modules/my-positions/selectors/close-position-status';

import { updateScalarMarketShareDenomination } from 'modules/market/actions/update-scalar-market-share-denomination';
import { cancelOrder } from 'modules/bids-asks/actions/cancel-order';

import { DENOMINATIONS } from 'modules/market/constants/share-denominations';
import { MARKET_USER_DATA_NAV_ITEMS } from 'modules/market/constants/market-user-data-nav-items';
import { MARKET_DATA_NAV_ITEMS } from 'modules/market/constants/market-data-nav-items';
import { OUTCOME_TRADE_NAV_ITEMS } from 'modules/outcomes/constants/outcome-trade-nav-items';

import getValue from 'utils/get-value';

const mapStateToProps = state => ({
  logged: getValue(state, 'loginAccount.address'),
  market: selectSelectedMarket(state),
  marketDataNavItems: MARKET_DATA_NAV_ITEMS,
  marketUserDataNavItems: MARKET_USER_DATA_NAV_ITEMS,
  orderCancellation: state.orderCancellation,
  numPendingReports: selectMarketsTotals(state).numPendingReports,
  isTradeCommitLocked: getValue(state, 'tradeCommitLock.isLocked'),
  scalarShareDenomination: {
    denominations: DENOMINATIONS,
    markets: state.scalarMarketsShareDenomination
  },
  outcomeTradeNavItems: OUTCOME_TRADE_NAV_ITEMS,
  closePositionStatus: selectClosePositionStatus(state),
  branch: state.branch,
});

const mapDispatchToProps = dispatch => ({
  orderCancellation: {
    cancelOrder: (orderID, marketID, type) => {
      dispatch(cancelOrder(orderID, marketID, type));
    }
  },
  scalarShareDenomination: {
    updateSelectedShareDenomination: (marketID, denomination) => {
      dispatch(updateScalarMarketShareDenomination(marketID, denomination));
    }
  }
});

const Market = connect(mapStateToProps, mapDispatchToProps)(MarketView);

export default Market;
