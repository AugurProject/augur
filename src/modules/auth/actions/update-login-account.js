import { updateFromAddress } from 'modules/contracts/actions/update-contract-api'

import getValue from 'utils/get-value'

export const UPDATE_LOGIN_ACCOUNT = 'UPDATE_LOGIN_ACCOUNT'
export const CLEAR_LOGIN_ACCOUNT = 'CLEAR_LOGIN_ACCOUNT'

export const updateLoginAccount = loginAccount => (dispatch) => {
  dispatch({ type: UPDATE_LOGIN_ACCOUNT, data: loginAccount })
  const address = getValue(loginAccount, 'keystore.address')
  if (address) dispatch(updateFromAddress(address))
}

export const clearLoginAccount = () => ({ type: CLEAR_LOGIN_ACCOUNT })
