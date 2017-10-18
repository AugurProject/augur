import { connect } from 'redux'
import { withRouter } from 'react-router-dom'

import AccountView from 'modules/account/components/account-view/account-view'

export default withRouter(connect()(AccountView))
