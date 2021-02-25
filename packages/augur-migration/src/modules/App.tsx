import React from 'react';
import '../assets/styles/shared.less';
import { Logo, PrimaryButton } from '@augurproject/augur-comps';
import Styles from './App.styles.less';
import { Migrate } from './migrate/migrate';
import { HashRouter } from 'react-router-dom';
import {
  ConnectAccountProvider,
  ConnectAccount,
} from '@augurproject/augur-comps';
import { AppStatusProvider, useAppStatusStore } from './stores/app-status';
import { UserProvider, useUserStore } from './stores/user';
import { PARA_CONFIG } from './stores/constants';

const AppBody = () => {
  //   const location = useLocation();
  //   const path = parsePath(location.pathname)[0];
  const { networkId } = PARA_CONFIG;
  const {
    isLogged,
    isMobile,
    actions: { setModal },
  } = useAppStatusStore();
  const {
    account,
    loginAccount,
    transactions,
    actions: { updateLoginAccount, logout, updateTransaction },
  } = useUserStore();
  //   const [lastUser, setLastUser] = useLocalStorage('lastUser', null);

  //   useEffect(() => {
  //     if (blocknumber && transactions) {
  //       transactions
  //         .filter((tx) => tx?.status === TX_STATUS.PENDING)
  //         .forEach((tx) => {
  //           const isTransactionMined = async (transactionHash, provider) => {
  //             const txReceipt = await provider.getTransactionReceipt(
  //               transactionHash
  //             );
  //             if (txReceipt && txReceipt.blockNumber) {
  //               return txReceipt;
  //             }
  //           };
  //           isTransactionMined(tx.hash, loginAccount.library).then((response) => {
  //             if (response?.confirmations > 0) {
  //               updateTxStatus(response, updateTransaction);
  //             }
  //           });
  //         });
  //     }
  //   }, [transactions, blocknumber]);

  //   useEffect(() => {
  //     const isMetaMask = loginAccount?.library?.provider?.isMetaMask;
  //     if (isMetaMask && account) {
  //       setLastUser(account);
  //     } else if (!loginAccount?.active) {
  //       setLastUser(null);
  //     }
  //   }, [loginAccount]);

  //   const autoLogin = lastUser || null;
  const autoLogin = null;

  const handleAccountUpdate = async (activeWeb3) => {
    if (activeWeb3) {
      if (String(networkId) !== String(activeWeb3.chainId)) {
        updateLoginAccount({ chainId: activeWeb3.chainId });
      } else if (account && account !== activeWeb3.account) {
        logout();
        updateLoginAccount(activeWeb3);
      } else {
        updateLoginAccount(activeWeb3);
      }
    }
  };
  return (
    <div id="mainContent" className={Styles.App}>
      <Logo darkTheme />
      <ConnectAccount
        updateLoginAccount={handleAccountUpdate}
        autoLogin={autoLogin}
        transactions={transactions}
        isMobile={false}
        setModal={setModal}
      />
      <span>Migrate V1 REP</span>
      <Migrate />
    </div>
  );
};

function App() {
  return (
    <HashRouter hashType="hashbang">
      {/* <ConnectAccountProvider> */}
      <UserProvider>
        <AppStatusProvider>
          <AppBody />
        </AppStatusProvider>
      </UserProvider>
      {/* </ConnectAccountProvider> */}
    </HashRouter>
  );
}

export default App;
