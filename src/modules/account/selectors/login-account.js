import { createSelector } from 'reselect';
import { selectLoginAccountState } from 'src/select-state';
import { augur } from 'services/augurjs';
import { formatRep, formatEther } from 'utils/format-number';
import generateDownloadAccountLink from 'modules/auth/helpers/generate-download-account-link';
import getABCUIContext from 'modules/auth/selectors/abc';
import store from 'src/store';

export default function () {
  return selectLoginAccount(store.getState());
}

export const selectLoginAccount = createSelector(
  selectLoginAccountState,
  (loginAccount) => {
    const trimmedAddress = loginAccount.address ? `${loginAccount.address.substring(0, 4)}...${loginAccount.address.substring(loginAccount.address.length - 4)}` : null;
    const trimmedLoginID = loginAccount.loginID ? `${loginAccount.loginID.substring(0, 4)}...${loginAccount.loginID.substring(loginAccount.loginID.length - 4)}` : null;
    const linkText = loginAccount.isUnlocked ? trimmedAddress : loginAccount.name || trimmedLoginID;
    if (loginAccount.airbitzAccount) {
      loginAccount.onAirbitzManageAccount = () => (
        getABCUIContext().openManageWindow(loginAccount.airbitzAccount, (err) => {
          if (err) console.error('onAirbitzManageAccount:', err);
        })
      );
    }
    return {
      ...loginAccount,
      ...generateDownloadAccountLink(loginAccount.address, augur.accounts.account.keystore),
      trimmedLoginID,
      trimmedAddress,
      linkText,
      rep: formatRep(loginAccount.rep, { zeroStyled: false, decimalsRounded: 1 }),
      ether: formatEther(loginAccount.ether, { zeroStyled: false, decimalsRounded: 2 }),
      realEther: formatEther(loginAccount.realEther, { zeroStyled: false, decimalsRounded: 2 })
    };
  }
);
