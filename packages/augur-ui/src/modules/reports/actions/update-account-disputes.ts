export const REMOVE_ACCOUNT_DISPUTE = "REMOVE_ACCOUNT_DISPUTE";
export const UPDATE_ACCOUNT_DISPUTE = "UPDATE_ACCOUNT_DISPUTE";
export const CLEAR_ACCOUNT_DISPUTES = "CLEAR_ACCOUNT_DISPUTES";

export function removeAccountDispute(accountDisputesData: any) {
  return { type: REMOVE_ACCOUNT_DISPUTE, data: { accountDisputesData } };
}

export function addUpdateAccountDispute(accountDisputesData: any) {
  return { type: UPDATE_ACCOUNT_DISPUTE, data: { accountDisputesData } };
}

export function clearAccountDisputes() {
  return { type: CLEAR_ACCOUNT_DISPUTES };
}
