import { connect } from "react-redux";

import OpenOrders from "modules/portfolio/components/orders/open-orders";
import * as constants from "modules/common/constants";
import selectMarketsOpenOrders from "modules/portfolio/selectors/select-markets-open-orders";
import { AppStatus } from "modules/app/store/app-status";

const mapStateToProps = (state) => selectMarketsOpenOrders();

const mapDispatchToProps = (dispatch) => ({
  claimTradingProceeds: (marketId) =>
    AppStatus.actions.setModal({ type: constants.MODAL_CLAIM_MARKETS_PROCEEDS, marketId }),
});

const OpenOrdersContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(OpenOrders);

export default OpenOrdersContainer;
