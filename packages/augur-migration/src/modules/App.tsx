import React, {useEffect} from 'react';
import '../assets/styles/shared.less';
import { Logo } from '@augurproject/augur-comps';
import Styles from './App.styles.less';
import { Migrate } from './migrate/migrate';
import { HashRouter } from 'react-router-dom';
import { ConnectAccountProvider } from '@augurproject/augur-comps';
import { AppStatusProvider, useAppStatusStore } from './stores/app-status';
import { UserProvider } from './stores/user';
import ModalView from './modal/modal-view';
import { ConnectAccountButton } from './shared/connect-account-button';
import {
  useUserBalances,
  useFinalizeUserTransactions,
  useUpdateApprovals,
} from './stores/utils';

const kovanTime = 3000; 

const AppBody = () => {
  const { modal, actions: { setTimestamp } } = useAppStatusStore();
  const modalShowing = Object.keys(modal).length !== 0;
  
  useUserBalances();
  useFinalizeUserTransactions();
  useUpdateApprovals();

  useEffect(() => {
      const timer = window.setInterval(() => {
        setTimestamp(Date.now() + 1);
      }, kovanTime);
      return () => {
        window.clearInterval(timer);
      };
  }, []);

  return (
    <div id="mainContent" className={Styles.App}>
      {modalShowing && <ModalView />}
      <div>
        <Logo />
        <ConnectAccountButton />
      </div>

      <span>Migrate V1 REP</span>
      <Migrate />
    </div>
  );
};

function App() {
  return (
    <HashRouter hashType="hashbang">
      <ConnectAccountProvider>
          <UserProvider>
            <AppStatusProvider>
              <AppBody />
            </AppStatusProvider>
          </UserProvider>
      </ConnectAccountProvider>
    </HashRouter>
  );
}

export default App;
