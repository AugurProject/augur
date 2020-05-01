import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Notifications from 'modules/account/components/notifications';
import { selectNotifications } from 'modules/notifications/selectors/notification-state';
import { updateReadNotifications } from 'modules/notifications/actions/update-notifications';
import { selectMarket } from 'modules/markets/selectors/market';
import { AppState } from 'appStore';
import {
  MODAL_CLAIM_MARKETS_PROCEEDS,
  MODAL_CLAIM_FEES,
  MODAL_UNSIGNED_ORDERS,
  MODAL_OPEN_ORDERS,
  MODAL_REPORTING,
  MODAL_FINALIZE_MARKET,
} from 'modules/common/constants';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { NodeStyleCallback, Notification } from 'modules/types';
import { AppStatusState, AppStatusActions } from 'modules/app/store/app-status';

// TODO create state Interface
const mapStateToProps = (state: AppState) => {
  const notifications = selectNotifications(state);
  const {
    blockchain: { currentAugurTimestamp },
  } = AppStatusState.get();
  return {
    notifications,
    currentAugurTimestamp,
    disputingWindowEndTime:
      (state.universe.disputeWindow && state.universe.disputeWindow.endTime) ||
      0,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => {
  const { setModal } = AppStatusActions.actions;
  return {
    updateReadNotifications: (notifications: Notification[]) =>
      dispatch(updateReadNotifications(notifications)),
    claimMarketsProceeds: (marketIds: string[], cb: NodeStyleCallback) =>
      setModal({ type: MODAL_CLAIM_MARKETS_PROCEEDS, marketIds, cb }),
    claimReportingFees: (reportingFees: any, cb: NodeStyleCallback) =>
      setModal({
        type: MODAL_CLAIM_FEES,
        cb,
        ...reportingFees,
      }),
    dispute: (marketId: string) => {
      const market = selectMarket(marketId);
      setModal({
        type: MODAL_REPORTING,
        market,
      });
    },
    unsignedOrdersModal: (marketId: string, cb: Function) =>
      setModal({
        type: MODAL_UNSIGNED_ORDERS,
        marketId,
        cb,
      }),
    openOrdersModal: (marketId: string, cb: Function) =>
      setModal({
        type: MODAL_OPEN_ORDERS,
        marketId,
        cb,
      }),
    showReportingModal: (marketId: string) => {
      const market = selectMarket(marketId);
      setModal({
        type: MODAL_REPORTING,
        market,
      });
    },
    finalize: (marketId: string, cb: NodeStyleCallback) =>
      setModal({
        type: MODAL_FINALIZE_MARKET,
        cb,
        marketId,
      }),
  };
};
const NotificationsContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Notifications)
);

export default NotificationsContainer;
