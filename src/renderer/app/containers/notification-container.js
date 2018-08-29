import { connect } from 'react-redux'
import { Notifications } from '../components/notifications/notifications'
import { removeNotification } from '../actions/notifications'
import { INFO_NOTIFICATION } from '../../../utils/constants'

const mapStateToProps = state => ({
  infoNotifications: state.notifications[INFO_NOTIFICATION] || []
})

const mapDispatchToProps = dispatch => ({
  removeNotification: notification => dispatch(removeNotification(notification))
})

const NotificationContainer = connect(mapStateToProps, mapDispatchToProps)(Notifications)

export default NotificationContainer
