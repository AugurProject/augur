import { connect } from 'react-redux';

import NotificationsView from 'modules/notifications/components/notifications-view';

const mapStateToProps = state => ({
  notifications: state.notifications
});

const NotificationsContainer = connect(mapStateToProps)(NotificationsView);

export default NotificationsContainer;
