import { connect } from 'react-redux';

import Nav from 'modules/nav/components/nav';

import { selectNotificationsAndSeenCount } from 'modules/notifications/selectors/notifications';

import getValue from 'utils/get-value';

const mapStateToProps = state => ({
  isAuthenticated: getValue(state, 'loginAccount.address'),
  notifications: selectNotificationsAndSeenCount(state)
});

// const mapDispatchToProps = dispatch => ({
//   onClick: href => dispatch(updateURL(href)),
//   updateNotification: (index, notification) => dispatch(updateNotification(index, notification)),
//   removeNotification: index => dispatch(removeNotification(index)),
//   clearNotifications: () => dispatch(clearNotifications())
// });

const NavContainer = connect(mapStateToProps)(Nav);

export default NavContainer;
