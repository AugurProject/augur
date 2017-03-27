// NOTE --  The following is mostly a half-step towards the ultimate implementation
//          of reselect (deferring work until the full-app refactor)

import { connect } from 'react-redux';
import portfolioView from 'modules/portfolio/components/portfolio-view';

import getPortfolio from 'modules/portfolio/selectors/portfolio';
import getClosePositionStatus from 'modules/my-positions/selectors/close-position-status';
import getScalarShareDenomination from 'modules/market/selectors/scalar-share-denomination';
import getOrderCancellation from 'modules/bids-asks/selectors/order-cancellation';

const mapStateToProps = state => ({
  ...getPortfolio(),
  activeView: state.activeView,
  branch: state.branch,
  isTradeCommitLocked: state.tradeCommitLock.isLocked,
  closePositionStatus: getClosePositionStatus(),
  scalarShareDenomination: getScalarShareDenomination(),
  orderCancellation: getOrderCancellation()
});

const Portfolio = connect(mapStateToProps)(portfolioView);

export default Portfolio;
