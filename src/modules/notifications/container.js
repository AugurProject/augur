import { connect } from 'react-redux'

import NotificationsView from 'modules/notifications/components/notifications-view'
import selectNotifications from 'modules/notifications/selectors/notifications'
import { updateNotification, removeNotification, clearNotifications } from 'modules/notifications/actions/update-notifications'

const mapStateToProps = state => ({
  notifications: selectNotifications()
})

const mapDispatchToProps = dispatch => ({
  updateNotification: (index, notification) => dispatch(updateNotification(index, notification)),
  removeNotification: index => dispatch(removeNotification(index)),
  clearNotifications: () => dispatch(clearNotifications())
})

const NotificationsContainer = connect(mapStateToProps, mapDispatchToProps)(NotificationsView)

export default NotificationsContainer
