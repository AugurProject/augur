import { loginWithEdge } from 'modules/auth/actions/login-with-edge'
import {
  selectEdgeContextState,
  selectEdgeLoadingState,
} from 'src/select-state'
import { makeEdgeUiContext } from 'edge-login-ui-web'

export const BEGIN_EDGE_LOADING = 'BEGIN_EDGE_LOADING'
export const UPDATE_EDGE_CONTEXT = 'UPDATE_EDGE_CONTEXT'

export const showEdgeLogin = history => (dispatch, getState) => {
  const state = getState()
  const edgeContext = selectEdgeContextState(state)
  const edgeLoading = selectEdgeLoadingState(state)
  const loginWindowOptions = {
    onLogin: edgeAccount => dispatch(loginWithEdge(edgeAccount, history)),
  }

  if (edgeContext) {
    edgeContext.openLoginWindow(loginWindowOptions)
  } else if (!edgeLoading) {
    dispatch({ type: BEGIN_EDGE_LOADING })
    makeEdgeUiContext({
      apiKey: 'e239ec875955ec7474628a1dc3d449c8ea8e1b48',
      appId: 'net.augur.app',
      hideKeys: true,
      vendorName: 'Augur',
      vendorImageUrl:
        'https://airbitz.co/go/wp-content/uploads/2016/08/augur_logo_100.png',
    }).then((edgeContext) => {
      dispatch({ type: UPDATE_EDGE_CONTEXT, data: edgeContext })
      edgeContext.openLoginWindow(loginWindowOptions)
    })
  }
}
