import React from 'react';
import '../assets/styles/shared.less';
import { Logo, PrimaryButton } from '@augurproject/augur-comps';
import Styles from './App.styles.less';
import { Migrate } from './migrate/migrate';
import { HashRouter } from 'react-router-dom';
// import { ConnectAccountProvider } from '@augurproject/augur-comps';
import { AppStatusProvider, useAppStatusStore } from './stores/app-status';
// import { UserProvider } from './stores/user';

const AppBody = () => {
  return (
    <div id="mainContent" className={Styles.App}>
      <Logo darkTheme/>
      <PrimaryButton text='Connect' darkTheme />
      <span>Migrate V1 REP</span>
      <Migrate />
    </div>
  );
};

function App() {
  return (
    <HashRouter hashType="hashbang">
      {/* <ConnectAccountProvider>
          <UserProvider> */}
            <AppStatusProvider>
              <AppBody />
              </AppStatusProvider>
          {/* </UserProvider>
      </ConnectAccountProvider> */}
    </HashRouter>
  );
}

export default App;
