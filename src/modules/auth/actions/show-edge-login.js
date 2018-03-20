import { loginWithEdge } from 'modules/auth/actions/login-with-edge'
import { selectEdgeContextState } from 'src/select-state'

export const showEdgeLogin = history => (dispatch, getState) => {
  const edgeContext = selectEdgeContextState(getState())

  edgeContext.openLoginWindow({
    onLogin: edgeAccount => dispatch(loginWithEdge(edgeAccount, history)),
  })
}
