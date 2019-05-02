import { connect } from "react-redux";

import OpenOrders from "modules/portfolio/components/orders/open-orders";
import { updateModal } from "modules/modal/actions/update-modal";
import * as constants from "src/modules/common-elements/constants";
import selectMarketsOpenOrders from "modules/portfolio/selectors/select-markets-open-orders";

const mapStateToProps = state => selectMarketsOpenOrders(state);

const mapDispatchToProps = dispatch => ({
  claimTradingProceeds: marketId =>
    dispatch(
      updateModal({ type: constants.MODAL_CLAIM_TRADING_PROCEEDS, marketId })
    )
});

const OpenOrdersContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(OpenOrders);

export default OpenOrdersContainer;
