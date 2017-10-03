import { loadAccountDataFromLocalStorage } from 'modules/auth/actions/load-account-data-from-local-storage';
import { updateAssets } from 'modules/auth/actions/update-assets';
import { updateLoginAccount } from 'modules/auth/actions/update-login-account';

export const loadAccountData = account => (dispatch, getState) => {
  if (!account || !account.address) return console.error('account address required');
  dispatch(loadAccountDataFromLocalStorage(account.address));
  dispatch(updateLoginAccount(account));
  dispatch(updateAssets());
};
