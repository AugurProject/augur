import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Edge from 'modules/auth/components/edge-create/edge-create'
import { showEdgeLogin } from 'modules/auth/actions/show-edge-login'
import { prepareEdgeContext } from 'modules/auth/actions/prepare-edge-context'
import { selectEdgeContextState } from 'src/select-state'

const mapDispatchToProps = dispatch => ({
  edgeLoginLink: history => dispatch(showEdgeLogin(history)),
  edgeOnLoad: history => dispatch(prepareEdgeContext(history)),
})

const mapStateToProps = state => ({
  edgeContext: selectEdgeContextState(state),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Edge))
