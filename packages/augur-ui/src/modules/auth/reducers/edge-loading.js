import {
  BEGIN_EDGE_LOADING,
  UPDATE_EDGE_CONTEXT
} from "modules/auth/actions/show-edge-login";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = false;

export default function(edgeLoading = DEFAULT_STATE, action) {
  switch (action.type) {
    case BEGIN_EDGE_LOADING:
      return true;
    case UPDATE_EDGE_CONTEXT:
      return false;
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return edgeLoading;
  }
}
