export const IS_LOGGED = "isLogged";
export const LEDGER_STATUS = "ledgerStatus";
export const EDGE_LOADING = "edgeLoading";
export const EDGE_CONTEXT = "edgeContext";
export const UPDATE_AUTH_STATUS = "UPDATE_AUTH_STATUS";

export function updateAuthStatus(statusKey, value) {
  return {
    type: UPDATE_AUTH_STATUS,
    data: {
      statusKey,
      value
    }
  };
}
