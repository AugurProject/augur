import React from 'react';
import '../assets/styles/shared.less';
import { Logo } from '@augurproject/augur-comps';
import Styles from './App.styles.less';
import { Migrate } from './migrate/migrate';
import { HashRouter } from 'react-router-dom';
import {
  ConnectAccountProvider,
} from '@augurproject/augur-comps';
import { AppStatusProvider, useAppStatusStore } from './stores/app-status';
import { UserProvider } from './stores/user';
import ModalView from './modal/modal-view';
import { ConnectAccountButton } from './shared/connect-account-button';
import { useUserBalances } from './stores/utils';

const AppBody = () => {
  const {
    modal,
  } = useAppStatusStore();
  const modalShowing = Object.keys(modal).length !== 0;
  useUserBalances();
  return (
    <div id="mainContent" className={Styles.App}>
      {modalShowing && <ModalView />}
      <Logo darkTheme />
      <ConnectAccountButton />
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
