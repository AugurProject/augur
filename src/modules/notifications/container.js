import { connect } from 'react-redux';

import NotificationsView from 'modules/notifications/components/notifications-view';
import selectNotifications from 'modules/notifications/selectors/notifications';

const mapStateToProps = state => ({
  notifications: selectNotifications()
});

const NotificationsContainer = connect(mapStateToProps)(NotificationsView);

export default NotificationsContainer;
