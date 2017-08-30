import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import Nav from 'modules/nav/components/nav'

import { selectNotificationsAndSeenCount } from 'modules/notifications/selectors/notifications'

import getValue from 'utils/get-value'

const mapStateToProps = state => ({
  isAuthenticated: getValue(state, 'loginAccount.address'),
  notifications: selectNotificationsAndSeenCount(state)
})

const NavContainer = withRouter(connect(mapStateToProps)(Nav))

export default NavContainer
