import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import MarketRow from "modules/portfolio/components/common/market-row";
import { updateModal } from "modules/modal/actions/update-modal";
import { AppState } from "appStore";
import { MODAL_UNSIGNED_ORDERS } from "modules/common/constants";

const mapStateToProps = (state: AppState) => ({});

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

const mergeProps = (sP: any, dP: any, oP: any) => ({
  ...oP,
  ...sP,
  ...dP,
});

const MarketRowContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(MarketRow),
);

export default MarketRowContainer;
