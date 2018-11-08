import { connect } from "react-redux";

import NotificationsView from "modules/notifications/components/notifications-view/notifications-view";
import { selectInfoNotificationsAndSeenCount } from "modules/notifications/selectors/notifications";
import {
  updateNotification,
  removeNotification,
  clearNotifications
} from "modules/notifications/actions/notifications";

const mapStateToProps = state => {
  const { notifications } = selectInfoNotificationsAndSeenCount(state);
  return {
    notifications
  };
};

const mapDispatchToProps = dispatch => ({
  updateNotification: (id, notification) =>
    dispatch(updateNotification(id, notification)),
  removeNotification: id => dispatch(removeNotification(id)),
  clearNotifications: () => dispatch(clearNotifications())
});

const NotificationsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationsView);

export default NotificationsContainer;
