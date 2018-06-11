import { makeEdgeUiContext } from 'edge-login-ui-web'
import { selectEdgeContextState } from 'src/select-state'

export const UPDATE_EDGE_CONTEXT = 'UPDATE_EDGE_CONTEXT'

export const prepareEdgeContext = history => (dispatch, getState) => {
  if (selectEdgeContextState(getState()) == null) {
    makeEdgeUiContext({
      apiKey: 'e239ec875955ec7474628a1dc3d449c8ea8e1b48',
      appId: 'net.augur.app',
      hideKeys: true,
      vendorName: 'Augur',
      vendorImageUrl: 'https://airbitz.co/go/wp-content/uploads/2016/08/augur_logo_100.png',
    }).then(edgeContext => dispatch({ type: UPDATE_EDGE_CONTEXT, data: edgeContext }))
  }
}
