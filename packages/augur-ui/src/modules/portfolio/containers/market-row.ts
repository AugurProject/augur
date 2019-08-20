import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import MarketRow from "modules/portfolio/components/common/market-row";
import { updateModal } from "modules/modal/actions/update-modal";
import { AppState } from "store";
import { MODAL_UNSIGNED_ORDERS } from "modules/common/constants";

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  unsignedOrdersModal: (marketId: string, cb: Function) =>
    dispatch(
      updateModal({
        type: MODAL_UNSIGNED_ORDERS,
        marketId,
        cb,
      }),
    )
});

const MarketRowContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(MarketRow),
);

export default MarketRowContainer;
