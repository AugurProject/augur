import { updateFromAddress } from 'modules/contracts/actions/update-contract-api';
import { base58Encode } from 'utils/base-58';

export const UPDATE_LOGIN_ACCOUNT = 'UPDATE_LOGIN_ACCOUNT';
export const CLEAR_LOGIN_ACCOUNT = 'CLEAR_LOGIN_ACCOUNT';

export const changeAccountName = name => (dispatch, getState) => {
  const loginID = base58Encode({ ...getState().loginAccount, name });
  dispatch({ type: UPDATE_LOGIN_ACCOUNT, data: { name, loginID } });
};

export const updateLoginAccount = loginAccount => (dispatch, getState) => {
  if (loginAccount && loginAccount.address) dispatch(updateFromAddress(loginAccount.address));
  dispatch({ type: UPDATE_LOGIN_ACCOUNT, data: loginAccount });
};

export const clearLoginAccount = () => ({ type: CLEAR_LOGIN_ACCOUNT });
