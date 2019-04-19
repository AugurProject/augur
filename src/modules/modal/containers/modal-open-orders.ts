import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { UnsignedOrders } from "modules/modal/unsigned-orders";
import { selectMarket } from "modules/markets/selectors/market";
import { closeModal } from "modules/modal/actions/close-modal";

import { cancelAllOpenOrders } from "modules/orders/actions/cancel-order";

const mapStateToProps = (state: any) => {
  const market = selectMarket(state.modal.marketId);
  return {
    modal: state.modal,
    market,
    loginAccount: state.loginAccount,
    isMobile: state.appStatus.isMobile
  };
};

const mapDispatchToProps = (dispatch: Function) => ({
  closeModal: () => dispatch(closeModal()),
  cancelAllOpenOrders: (orders, cb) => dispatch(cancelAllOpenOrders(orders, cb))
});

const mergeProps = (sP, dP, oP) => {
  const openOrders = sP.market.userOpenOrders || [];
  const { description: marketTitle } = sP.market;
  return {
    isMobile: sP.isMobile,
    title: "Open Orders in resolved market",
    description: ["You have open orders in this resolved market:"],
    openOrders: true,
    marketTitle,
    orders: openOrders,
    buttons: [
      {
        text: "Cancel All",
        action: () => {
          dP.cancelAllOpenOrders(openOrders);
          dP.closeModal();
        }
      }
    ],
    closeAction: () => {
      if (sP.modal.cb) {
        sP.modal.cb();
      }
      dP.closeModal();
    }
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(UnsignedOrders)
);
