import { makeEdgeUiContext } from 'edge-login-ui-web'

import { showEdgeLogin } from 'modules/auth/actions/show-edge-login'
import { selectEdgeContextState } from 'src/select-state'

export const UPDATE_EDGE_CONTEXT = 'UPDATE_EDGE_CONTEXT'

const hasUsers = edgeContext =>
  edgeContext.users && Object.keys(edgeContext.users).length > 0

export const prepareEdgeContext = history => (dispatch, getState) => {
  const edgeContext = selectEdgeContextState(getState())

  if (edgeContext == null) {
    return makeEdgeUiContext({
      apiKey: 'e239ec875955ec7474628a1dc3d449c8ea8e1b48',
      appId: 'net.augur.app',
      assetsPath: '/assets/edge/index.html',
      vendorName: 'Augur',
      vendorImageUrl:
        'https://airbitz.co/go/wp-content/uploads/2016/08/augur_logo_100.png',
    }).then((edgeContext) => {
      dispatch({ type: UPDATE_EDGE_CONTEXT, data: edgeContext })
      if (hasUsers(edgeContext)) {
        dispatch(showEdgeLogin(history))
      }
    })
  }

  if (hasUsers(edgeContext)) {
    dispatch(showEdgeLogin(history))
  }
}
