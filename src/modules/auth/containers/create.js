import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Create from 'modules/auth/components/create/create'

const mapStateToProps = state => ({
  isMobile: state.isMobile,
})

export default withRouter(connect(mapStateToProps)(Create))
