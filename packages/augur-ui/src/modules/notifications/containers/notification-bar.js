import { connect } from "react-redux";
import { NotificationBar } from "modules/notifications/components/notification-bar/notification-bar";
import { selectUndissmissedOrphanedOrders } from "modules/orders/selectors/select-undissmissed-orphaned-orders";
import { dismissOrphanedOrder } from "modules/orders/actions/orphaned-orders";
import { selectMarket } from "modules/markets/selectors/market";

const mapStateToProps = state => {
  const notifications = selectUndissmissedOrphanedOrders(state);
  let market = null;
  let marketsNumber = 1;
  if (notifications.length === 1) {
    market = selectMarket(notifications[0].marketId);
  } else {
    const marketIds = notifications
      .map(notification => notification.marketId)
      .filter((value, index, self) => self.indexOf(value) === index);
    marketsNumber = marketIds.length;
  }
  return {
    isMobileSmall: state.appStatus.isMobileSmall,
    notifications,
    market,
    marketsNumber
  };
};

const mapDispatchToProps = dispatch => ({
  dismissFn: order => dispatch(dismissOrphanedOrder(order))
});

export const NotificationBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationBar);
