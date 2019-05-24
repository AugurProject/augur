import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import MarketOrdersPositionsTable from "modules/market/components/market-orders-positions-table/market-orders-positions-table";
import { selectMarket } from "modules/markets/selectors/market";
import {
  MODAL_CLAIM_TRADING_PROCEEDS
} from "modules/common-elements/constants";
import { selectCurrentTimestamp } from "store/select-state";
import { constants } from "services/augurjs";
import { updateModal } from "modules/modal/actions/update-modal";
import { createBigNumber } from "utils/create-big-number";
import { cancelAllOpenOrders } from "modules/orders/actions/cancel-order";
import { selectUserFilledOrders } from "modules/orders/selectors/filled-orders";
import getUserOpenOrders from "modules/orders/selectors/user-open-orders";

const mapStateToProps = (state, ownProps) => {
  const market = selectMarket(ownProps.marketId);
  const openOrders = getUserOpenOrders(market.id) || [];

  let canClaim = false;
  if (market.finalizationTime) {
    const endTimestamp = createBigNumber(market.finalizationTime).plus(
      createBigNumber(constants.CONTRACT_INTERVAL.CLAIM_PROCEEDS_WAIT_TIME)
    );
    const currentTimestamp = selectCurrentTimestamp(state);
    const timeHasPassed = createBigNumber(currentTimestamp).minus(endTimestamp);
    canClaim = timeHasPassed.toNumber() > 0;
  }

  const filledOrders = market.id
    ? selectUserFilledOrders(state, market.id)
    : [];
  const hasPending = Boolean(openOrders.find(order => order.pending));

  return {
    hasClaimableReturns: market.outstandingReturns && canClaim,
    winningOutcome: market.consensus && market.consensus.winningOutcome,
    hasPending,
    outcomes: market.outcomes || [],
    openOrders,
    market,
    filledOrders
  };
};

const mapDispatchToProps = dispatch => ({
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
