import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Notifications from "modules/account/components/notifications/notifications";
import { selectNotifications } from "modules/notifications/selectors/notification-state";
import { updateReadNotifications } from "modules/notifications/actions/update-notifications";
import { updateModal } from "modules/modal/actions/update-modal";

import {
  MODAL_FINALIZE_MARKET,
  MODAL_SELL_COMPLETE_SETS,
  MODAL_CLAIM_PROCEEDS,
  MODAL_CLAIM_FEES,
  MODAL_UNSIGNED_ORDERS,
  MODAL_OPEN_ORDERS
} from "modules/common-elements/constants";

// TODO create state Interface
const mapStateToProps = (state: any) => {
  const notifications = selectNotifications(state);

  return {
    notifications,
    isMobile: state.appStatus.isMobile,
    currentAugurTimestamp: state.blockchain.currentAugurTimestamp,
    reportingWindowStatsEndTime: state.reportingWindowStats.endTime
  };
};

const mapDispatchToProps = (dispatch: Function) => ({
  updateReadNotifications: (notifications: any) =>
    dispatch(updateReadNotifications(notifications)),
  finalizeMarketModal: (marketId: any, cb: Function) =>
    dispatch(updateModal({ type: MODAL_FINALIZE_MARKET, marketId, cb })),
  claimTradingProceeds: (cb: Function) =>
    dispatch(updateModal({ type: MODAL_CLAIM_PROCEEDS, cb })),
  claimReportingFees: (reportingFees: any, cb: Function) =>
    dispatch(
      updateModal({
        type: MODAL_CLAIM_FEES,
        cb,
        ...reportingFees
      })
    ),
  sellCompleteSetsModal: (marketId: any, numCompleteSets: any, cb: Function) =>
    dispatch(
      updateModal({
        type: MODAL_SELL_COMPLETE_SETS,
        marketId,
        numCompleteSets,
        cb
      })
    ),
  unsignedOrdersModal: (marketId: string, cb: Function) =>
    dispatch(
      updateModal({
        type: MODAL_UNSIGNED_ORDERS,
        marketId,
        cb
      })
    ),
  openOrdersModal: (marketId: string, cb: Function) =>
    dispatch(
      updateModal({
        type: MODAL_OPEN_ORDERS,
        marketId,
        cb
      })
    )
});

const NotificationsContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Notifications)
);

export default NotificationsContainer;
