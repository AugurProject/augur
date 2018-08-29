import { connect } from 'react-redux'
import { ShowErrors } from '../components/show-errors/show-errors'
import { removeNotification } from '../actions/notifications'
import { ERROR_NOTIFICATION } from '../../../utils/constants'

const mapStateToProps = state => ({
  errorNotifications: state.notifications[ERROR_NOTIFICATION] || []
})

const mapDispatchToProps = dispatch => ({
  removeError: notification => dispatch(removeNotification(notification))
})

const ShowErrorsContainer = connect(mapStateToProps, mapDispatchToProps)(ShowErrors)

export default ShowErrorsContainer
