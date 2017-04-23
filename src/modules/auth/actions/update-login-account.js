import { augur } from 'services/augurjs';
import { updateFromAddress } from 'modules/contracts/actions/update-contract-api';
import { base58Encode } from 'utils/base-58';

export const UPDATE_LOGIN_ACCOUNT = 'UPDATE_LOGIN_ACCOUNT';
export const CLEAR_LOGIN_ACCOUNT = 'CLEAR_LOGIN_ACCOUNT';

export const changeAccountName = name => {
  const accountObject = { ...augur.accounts.account, name };
  const loginID = base58Encode(accountObject);
  return { type: UPDATE_LOGIN_ACCOUNT, data: { name, loginID } };
};

export const updateLoginAccount = loginAccount => (dispatch, getState) => {
  if (data && data.address) dispatch(updateFromAddress(data.address));
  dispatch({ type: UPDATE_LOGIN_ACCOUNT, data: loginAccount });
};

export const clearLoginAccount = () => {
  return { type: CLEAR_LOGIN_ACCOUNT };
};
