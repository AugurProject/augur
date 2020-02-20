import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { UnsignedOrders } from 'modules/modal/unsigned-orders';
import { selectMarket } from 'modules/markets/selectors/market';
import { closeModal } from 'modules/modal/actions/close-modal';
import getUserOpenOrders from 'modules/orders/selectors/user-open-orders';
import { cancelAllOpenOrders } from 'modules/orders/actions/cancel-order';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';

const mapStateToProps = (state: AppState) => {
  const market = selectMarket(state.modal.marketId);
  const userOpenOrders = getUserOpenOrders(state.modal.marketId) || [];
  return {
    modal: state.modal,
    userOpenOrders,
    market,
    loginAccount: state.loginAccount,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  cancelAllOpenOrders: (orders, cb) =>
    dispatch(cancelAllOpenOrders(orders, cb)),
});

const mergeProps = (sP, dP, oP) => {
  const openOrders = sP.userOpenOrders;
  const { description: marketTitle } = sP.market;
  return {
    title: 'Open Orders in resolved market',
    description: ['You have open orders in this resolved market:'],
    openOrders: true,
    marketTitle,
    orders: openOrders,
    buttons: [
      {
        text: 'Cancel All',
        action: () => {
          dP.cancelAllOpenOrders(openOrders);
          dP.closeModal();
        },
      },
    ],
    closeAction: () => {
      if (sP.modal.cb) {
        sP.modal.cb();
      }
      dP.closeModal();
    },
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(UnsignedOrders)
);
