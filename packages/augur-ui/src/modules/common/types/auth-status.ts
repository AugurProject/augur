export const AUTH_STATUS = {
  IS_LOGGED: "isLogged",
  LEDGER_STATUS: "ledgerStatus",
  EDGE_LOADING: "edgeLoading",
  EDGE_CONTEXT: "edgeContext",
  IS_CONNECTION_TRAY_OPEN: "isConnectionTrayOpen",
  UPDATE_AUTH_STATUS: "UPDATE_AUTH_STATUS",
};

export interface AppStatus {
  isLogged: boolean|undefined;
  ledgerStatus: string|undefined;
  edgeLoading: boolean|undefined;
  edgeContext: string|undefined;
  isConnectionTrayOpen: boolean|undefined;
}

export interface AppStatusAction {
  statusKey: string;
  value: string|boolean|undefined;
}

export function updateAuthStatus(statusKey: string, value: string|boolean|undefined) {
  return {
    type: AUTH_STATUS.UPDATE_AUTH_STATUS,
    data: {
      statusKey,
      value,
    },
  };
}
