import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { selectNotifications } from "modules/notifications/selectors/notification-state";
import AccountView from "modules/account/components/account-view/account-view";

const mapStateToProps = state => {
  const notifications = selectNotifications(state);

  return {
    isMobile: state.appStatus.isMobile,
    newNotifications:
      notifications &&
      notifications.filter(notification => notification.isNew).length > 0
  };
};

const AccountViewContainer = withRouter(connect(mapStateToProps)(AccountView));

export default AccountViewContainer;
