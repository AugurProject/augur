import React, { useEffect } from 'react';
import { useAppStatusStore } from '../stores/app-status';
import { PARA_CONFIG } from '../stores/constants';
import { useLocalStorage } from '../stores/local-storage';
import { useUserStore } from '../stores/user';
import { ConnectAccount as CompsConnectAccount } from '@augurproject/augur-comps';
import { useMigrationStore } from '../stores/migration-store';

const { ConnectAccount } = CompsConnectAccount;
export const ConnectAccountButton = () => {
  const { networkId } = PARA_CONFIG;
  const {
    actions: { setModal },
  } = useAppStatusStore();
  const {
    account,
    loginAccount,
    transactions,
    actions: { updateLoginAccount, logout },
  } = useUserStore();
  const [lastUser, setLastUser] = useLocalStorage('lastUser', null);

  useEffect(() => {
    const isMetaMask = loginAccount?.library?.provider?.isMetaMask;
    if (isMetaMask && account) {
      setLastUser(account);
    } else if (!loginAccount?.active) {
      setLastUser(null);
    }
  }, [loginAccount]);

  const autoLogin = lastUser || null;
  const {
    actions: { updateTxFailed, updateMigrated },
  } = useMigrationStore();

  const handleAccountUpdate = async (activeWeb3) => {
    if (activeWeb3) {
      if (String(networkId) !== String(activeWeb3.chainId)) {
        updateLoginAccount({ chainId: activeWeb3.chainId });
      } else if (account && account !== activeWeb3.account) {
        logout();
        updateTxFailed(false);
        updateMigrated(false);
        updateLoginAccount(activeWeb3);
      } else {
        updateLoginAccount(activeWeb3);
      }
    }
  };
  return (
    <ConnectAccount
      updateLoginAccount={handleAccountUpdate}
      autoLogin={autoLogin}
      transactions={transactions}
      isMobile={false}
      setModal={setModal}
    />
  );
};
