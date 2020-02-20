import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Notifications from 'modules/account/components/notifications';
import { selectNotifications } from 'modules/notifications/selectors/notification-state';
import { updateReadNotifications } from 'modules/notifications/actions/update-notifications';
import { updateModal } from 'modules/modal/actions/update-modal';
import { selectMarket } from 'modules/markets/selectors/market';
import { AppState } from 'appStore';
import {
  MODAL_FINALIZE_MARKET,
  MODAL_CLAIM_MARKETS_PROCEEDS,
  MODAL_CLAIM_FEES,
  MODAL_UNSIGNED_ORDERS,
  MODAL_OPEN_ORDERS,
  MODAL_REPORTING,
} from 'modules/common/constants';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { NodeStyleCallback, Notification } from 'modules/types';

// TODO create state Interface
const mapStateToProps = (state: AppState) => {
  const notifications = selectNotifications(state);

  return {
    notifications,
    currentAugurTimestamp: state.blockchain.currentAugurTimestamp,
    disputingWindowEndTime: state.universe.disputeWindow && state.universe.disputeWindow.endTime || 0,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  updateReadNotifications: (notifications: Notification[]) =>
    dispatch(updateReadNotifications(notifications)),
  finalizeMarketModal: (marketId: string, cb: NodeStyleCallback) =>
    dispatch(updateModal({ type: MODAL_FINALIZE_MARKET, marketId, cb })),
  claimMarketsProceeds: (marketIds: string[], cb: NodeStyleCallback) =>
    dispatch(
      updateModal({ type: MODAL_CLAIM_MARKETS_PROCEEDS, marketIds, cb })
    ),
  claimReportingFees: (reportingFees: any, cb: NodeStyleCallback) =>
    dispatch(
      updateModal({
        type: MODAL_CLAIM_FEES,
        cb,
        ...reportingFees,
      })
    ),
    dispute: (marketId: string) => {
      const market = selectMarket(marketId);
      dispatch(
        updateModal({
          type: MODAL_REPORTING,
          market,
        })
      );
    },
  unsignedOrdersModal: (marketId: string, cb: Function) =>
    dispatch(
      updateModal({
        type: MODAL_UNSIGNED_ORDERS,
        marketId,
        cb,
      })
    ),
  openOrdersModal: (marketId: string, cb: Function) =>
    dispatch(
      updateModal({
        type: MODAL_OPEN_ORDERS,
        marketId,
        cb,
      })
    ),
  showReportingModal: (marketId: string) => {
    const market = selectMarket(marketId);
    dispatch(
      updateModal({
        type: MODAL_REPORTING,
        market
      }),
    )},
});

const NotificationsContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Notifications)
);

export default NotificationsContainer;
