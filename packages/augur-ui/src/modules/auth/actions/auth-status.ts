import { BaseAction } from "modules/types";

export const AUTH_STATUS = {
  IS_LOGGED: "isLogged",
  EDGE_LOADING: "edgeLoading",
  EDGE_CONTEXT: "edgeContext",
  IS_CONNECTION_TRAY_OPEN: "isConnectionTrayOpen",
  UPDATE_AUTH_STATUS: "UPDATE_AUTH_STATUS",
};

export function updateAuthStatus(statusKey: string, value: string|boolean|undefined): BaseAction {
  return {
    type: AUTH_STATUS.UPDATE_AUTH_STATUS,
    data: {
      statusKey,
      value,
    },
  };
}
