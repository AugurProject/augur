export const REMOVE_ACCOUNT_DISPUTE = 'REMOVE_ACCOUNT_DISPUTE'
export const UPDATE_ACCOUNT_DISPUTE = 'UPDATE_ACCOUNT_DISPUTE'
export const CLEAR_ACCOUNT_DISPUTES = 'CLEAR_ACCOUNT_DISPUTES'

export function removeAccountDispute(data) {
  return { type: REMOVE_ACCOUNT_DISPUTE, data }
}

export function addUpdateAccountDispute(data) {
  return { type: UPDATE_ACCOUNT_DISPUTE, data }
}

export function clearAccountDisputes() {
  return { type: CLEAR_ACCOUNT_DISPUTES }
}
