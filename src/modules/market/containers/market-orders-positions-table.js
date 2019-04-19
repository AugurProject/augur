import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import MarketOrdersPositionsTable from "modules/market/components/market-orders-positions-table/market-orders-positions-table";
import { selectMarket } from "modules/markets/selectors/market";
import { cancelOrphanedOrder } from "modules/orders/actions/orphaned-orders";
import {
  CATEGORICAL,
  MODAL_CLAIM_TRADING_PROCEEDS
} from "modules/common-elements/constants";
import { find } from "lodash";
import { selectCurrentTimestamp, selectOrphanOrders } from "src/select-state";
import { constants } from "services/augurjs";
import { updateModal } from "modules/modal/actions/update-modal";
import { createBigNumber } from "utils/create-big-number";
import { cancelAllOpenOrders } from "modules/orders/actions/cancel-order";

const mapStateToProps = (state, ownProps) => {
  const market = selectMarket(ownProps.marketId);
  const openOrders = market.userOpenOrders || [];

  const filteredOrphanOrders = selectOrphanOrders(state).filter(
    order => order.marketId === ownProps.marketId
  );

  filteredOrphanOrders.forEach(order => {
    const id = order.outcome;
    const outcome = find(market.outcomes, { id });
    order.outcomeName =
      market.marketType === CATEGORICAL
        ? outcome.description
        : outcome.name || order.price;
  });

  let canClaim = false;
  if (market.finalizationTime) {
    const endTimestamp = createBigNumber(market.finalizationTime).plus(
      createBigNumber(constants.CONTRACT_INTERVAL.CLAIM_PROCEEDS_WAIT_TIME)
    );
    const currentTimestamp = selectCurrentTimestamp(state);
    const timeHasPassed = createBigNumber(currentTimestamp).minus(endTimestamp);
    canClaim = timeHasPassed.toNumber() > 0;
  }

  const { filledOrders } = market;

  return {
    hasClaimableReturns: market.outstandingReturns && canClaim,
    winningOutcome: market.consensus && market.consensus.winningOutcome,
    isMobile: state.appStatus.isMobile,
    outcomes: market.outcomes || [],
    openOrders,
    orphanedOrders: filteredOrphanOrders,
    market,
    filledOrders
  };
};

const mapDispatchToProps = dispatch => ({
  cancelOrphanedOrder: (order, cb) => dispatch(cancelOrphanedOrder(order, cb)),
  claimTradingProceeds: (marketId, cb) =>
    dispatch(updateModal({ type: MODAL_CLAIM_TRADING_PROCEEDS, marketId, cb })),
  cancelAllOpenOrders: (orders, cb) => dispatch(cancelAllOpenOrders(orders, cb))
});

const MarketOrdersPositionsTableContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MarketOrdersPositionsTable)
);

export default MarketOrdersPositionsTableContainer;
