import { loginWithEdge } from "modules/auth/actions/login-with-edge";
import {
  updateAuthStatus,
  EDGE_CONTEXT,
  EDGE_LOADING
} from "modules/auth/actions/update-auth-status";
import {
  selectEdgeContextState,
  selectEdgeLoadingState
} from "src/select-state";
import { makeEdgeUiContext } from "edge-login-ui-web";

export const BEGIN_EDGE_LOADING = "BEGIN_EDGE_LOADING";
export const UPDATE_EDGE_CONTEXT = "UPDATE_EDGE_CONTEXT";

export const showEdgeLogin = history => (dispatch, getState) => {
  const state = getState();
  const edgeContext = selectEdgeContextState(state);
  const edgeLoading = selectEdgeLoadingState(state);

  if (edgeContext) {
    edgeContext.on("login", edgeAccount =>
      dispatch(loginWithEdge(edgeAccount, history))
    );
    edgeContext.showLoginWindow();
  } else if (!edgeLoading) {
    dispatch(updateAuthStatus(EDGE_LOADING, true));
    makeEdgeUiContext({
      apiKey: "e239ec875955ec7474628a1dc3d449c8ea8e1b48",
      appId: "net.augur.app",
      hideKeys: true,
      vendorName: "Augur",
      vendorImageUrl:
        "https://airbitz.co/go/wp-content/uploads/2016/08/augur_logo_100.png"
    }).then(edgeContext => {
      dispatch(updateAuthStatus(EDGE_LOADING, false));
      dispatch(updateAuthStatus(EDGE_CONTEXT, edgeContext));
      edgeContext.on("login", edgeAccount =>
        dispatch(loginWithEdge(edgeAccount, history))
      );
      edgeContext.showLoginWindow();
    });
  }
};
