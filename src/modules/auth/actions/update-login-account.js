import { updateFromAddress } from 'modules/contracts/actions/update-contract-api'

export const UPDATE_LOGIN_ACCOUNT = 'UPDATE_LOGIN_ACCOUNT'
export const CLEAR_LOGIN_ACCOUNT = 'CLEAR_LOGIN_ACCOUNT'

export const updateLoginAccount = loginAccount => (dispatch) => {
  dispatch({ type: UPDATE_LOGIN_ACCOUNT, data: loginAccount })
  if (loginAccount && loginAccount.address) dispatch(updateFromAddress(loginAccount.address))
}

export const clearLoginAccount = () => ({ type: CLEAR_LOGIN_ACCOUNT })
