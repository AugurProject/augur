import { connect } from 'react-redux'
import { Notifications } from '../components/notifications/notifications'
import { removeNotification } from '../actions/notifications'

const mapStateToProps = state => ({
  notifications: state.notifications
})

const mapDispatchToProps = dispatch => ({
  removeNotification: notification => dispatch(removeNotification(notification))
})

const NotificationContainer = connect(mapStateToProps, mapDispatchToProps)(Notifications)

export default NotificationContainer
