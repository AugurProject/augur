import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import {
  selectCurrentTimestampInSeconds,
  selectOrphanOrders
} from "src/select-state";
import { determineMarketLinkType } from "modules/markets/helpers/determine-market-link-type";
import MarketPortfolioCard from "modules/portfolio/components/market-portfolio-card/market-portfolio-card";
import { selectMarket } from "modules/markets/selectors/market";
import { sendFinalizeMarket } from "modules/markets/actions/finalize-market";
import { getWinningBalance } from "modules/reports/actions/get-winning-balance";
import { cancelOrphanedOrder } from "modules/orders/actions/orphaned-orders";
import { CATEGORICAL } from "modules/markets/constants/market-types";
import { find } from "lodash";
import { updateModal } from "modules/modal/actions/update-modal";
import { MODAL_CLAIM_TRADING_PROCEEDS } from "modules/modal/constants/modal-types";

const mapStateToProps = (state, ownProps) => {
  const filteredOrphanOrders = selectOrphanOrders(state).filter(
    order => order.marketId === ownProps.market.id
  );

  filteredOrphanOrders.forEach(order => {
    const id = order.outcome;
    const outcome = find(ownProps.market.outcomes, { id });
    order.outcomeName =
      ownProps.market.marketType === CATEGORICAL
        ? outcome.description
        : outcome.name || order.price;
  });

  return {
    currentTimestamp: selectCurrentTimestampInSeconds(state),
    linkType:
      ownProps.linkType ||
      determineMarketLinkType(
        selectMarket(ownProps.market.id),
        state.loginAccount
      ),
    orphanedOrders: filteredOrphanOrders
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  getWinningBalances: marketIds => dispatch(getWinningBalance(marketIds)),
  finalizeMarket: marketId => dispatch(sendFinalizeMarket(marketId)),
  cancelOrphanedOrder: (order, cb) => dispatch(cancelOrphanedOrder(order, cb)),
  claimTradingProceeds: (marketId, cb) =>
    dispatch(updateModal({ type: MODAL_CLAIM_TRADING_PROCEEDS, marketId, cb }))
});

const MarketPortfolioCardContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MarketPortfolioCard)
);

export default MarketPortfolioCardContainer;
