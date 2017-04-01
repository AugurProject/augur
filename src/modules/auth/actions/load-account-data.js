import { anyAccountBalancesZero } from 'modules/auth/selectors/balances';
import { fundNewAccount } from 'modules/auth/actions/fund-new-account';
import { loadAccountDataFromLocalStorage } from 'modules/auth/actions/load-account-data-from-local-storage';
import { loadRegisterBlockNumber } from 'modules/auth/actions/load-register-block-number';
import { updateAssets } from 'modules/auth/actions/update-assets';
import { updateLoginAccount } from 'modules/auth/actions/update-login-account';
import { displayTopicsPage } from 'modules/link/actions/display-topics-page';

export const loadAccountData = account => (dispatch, getState) => {
  if (!account || !account.address) return console.error({ message: 'account address required' });
  dispatch(loadAccountDataFromLocalStorage(account.address));
  dispatch(updateLoginAccount({ address: account.address }));
  if (account.isUnlocked) dispatch(updateLoginAccount({ isUnlocked: !!account.isUnlocked }));
  if (account.loginID) dispatch(updateLoginAccount({ loginID: account.loginID }));
  if (account.name) dispatch(updateLoginAccount({ name: account.name }));
  if (account.airbitzAccount) dispatch(updateLoginAccount({ airbitzAccount: account.airbitzAccount }));
  if (account.registerBlockNumber) dispatch(updateLoginAccount({ registerBlockNumber: account.registerBlockNumber }));
  dispatch(displayTopicsPage());
  dispatch(updateAssets((err, balances) => {
    if (err) return console.error(err);
    if (anyAccountBalancesZero(balances)) {
      dispatch(fundNewAccount());
    } else {
      dispatch(loadRegisterBlockNumber());
    }
  }));
};
