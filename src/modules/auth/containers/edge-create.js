import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Edge from 'modules/auth/components/edge-create/edge-create'
import { showEdgeLogin } from 'modules/auth/actions/show-edge-login'
import { selectEdgeLoadingState } from 'src/select-state'

const mapDispatchToProps = dispatch => ({
  edgeLoginLink: history => dispatch(showEdgeLogin(history)),
})

const mapStateToProps = state => ({
  edgeLoading: selectEdgeLoadingState(state),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Edge))
