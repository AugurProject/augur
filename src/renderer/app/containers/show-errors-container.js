import { connect } from 'react-redux'
import { ShowErrors } from '../components/show-errors/show-errors'
import { removeNotification } from '../actions/notifications'
import { ERROR_NOTIFICATION } from '../../../utils/constants'

const mapStateToProps = state => {

  return {
    notifications: state.notifications || {}
  }
}

const mapDispatchToProps = dispatch => ({
  removeError: notification => dispatch(removeNotification(notification))
})

const ShowErrorsContainer = connect(mapStateToProps, mapDispatchToProps)(ShowErrors)

export default ShowErrorsContainer
