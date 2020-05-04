import { connect } from "react-redux";

import * as constants from "modules/common/constants";
import FilledOrders from "modules/portfolio/components/orders/filled-orders";
import selectMarketsFillOrders from "modules/portfolio/selectors/select-markets-filled-orders";
import { AppStatus } from "modules/app/store/app-status";

const mapStateToProps = (state) => selectMarketsFillOrders();

const mapDispatchToProps = (dispatch) => ({
  claimTradingProceeds: (marketId) =>
    AppStatus.actions.setModal({ type: constants.MODAL_CLAIM_MARKETS_PROCEEDS, marketId }),
});

const FilledOrdersContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FilledOrders);

export default FilledOrdersContainer;
