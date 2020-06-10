import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { UnsignedOrders } from 'modules/modal/unsigned-orders';
import { selectMarket } from 'modules/markets/selectors/market';
import getUserOpenOrders from 'modules/orders/selectors/user-open-orders';
import { cancelAllOpenOrders } from 'modules/orders/actions/cancel-order';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState) => {
  const { loginAccount, modal } = AppStatus.get();
  const market = selectMarket(modal.marketId);
  const userOpenOrders = getUserOpenOrders(modal.marketId) || [];
  return {
    modal,
    userOpenOrders,
    market,
    loginAccount,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => AppStatus.actions.closeModal(),
  cancelAllOpenOrders: (orders, cb) =>
    dispatch(cancelAllOpenOrders(orders, cb)),
});

const mergeProps = (sP, dP, oP) => {
  const openOrders = sP.userOpenOrders;
  const { description: marketTitle, marketId } = sP.market;
  return {
    title: 'Open Orders in resolved market',
    description: ['You have open orders in this resolved market:'],
    marketId,
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
      {
        text: 'Close',
        action: () => {
          if (sP.modal.cb) {
            sP.modal.cb();
          }
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
