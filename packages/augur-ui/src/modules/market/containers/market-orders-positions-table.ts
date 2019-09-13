import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import MarketOrdersPositionsTable from 'modules/market/components/market-orders-positions-table/market-orders-positions-table';
import { selectMarket } from 'modules/markets/selectors/market';
import { createBigNumber } from 'utils/create-big-number';
import { cancelAllOpenOrders } from 'modules/orders/actions/cancel-order';
import { selectUserFilledOrders } from 'modules/orders/selectors/filled-orders';
import getUserOpenOrders from 'modules/orders/selectors/user-open-orders';
import { ZERO } from 'modules/common/constants';

const mapStateToProps = (state, ownProps) => {
  const market = ownProps.market || selectMarket(ownProps.marketId);
  let openOrders = getUserOpenOrders(market.id) || [];

  let canClaim = false;
  if (
    state.accountPositions[ownProps.marketId] &&
    createBigNumber(
      state.accountPositions[ownProps.marketId].totalUnclaimedProceeds
    ).gt(ZERO)
  ) {
    canClaim = true;
  }

  const filledOrders = market.id
    ? selectUserFilledOrders(state, market.id)
    : [];
  const hasPending = Boolean(openOrders.find(order => order.pending));

  if (ownProps.preview) {
    openOrders = [];
    Object.values(market.orderBook).map(outcome => {
      openOrders = openOrders.concat(outcome);
    });
  }

  return {
    hasClaimableReturns: market.outstandingReturns && canClaim,
    winningOutcome: market.consensus && market.consensus.winningOutcome,
    hasPending,
    outcomes: market.outcomes || [],
    openOrders,
    market,
    filledOrders,
  };
};

const mapDispatchToProps = dispatch => ({
  cancelAllOpenOrders: (orders, cb) =>
    dispatch(cancelAllOpenOrders(orders, cb)),
});

const MarketOrdersPositionsTableContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MarketOrdersPositionsTable)
);

export default MarketOrdersPositionsTableContainer;
