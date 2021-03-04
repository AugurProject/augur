import React, { useEffect } from 'react';
import '../assets/styles/shared.less';
import { Logo, ConnectAccount } from '@augurproject/augur-comps';
import Styles from './App.styles.less';
import { Migrate } from './migrate/migrate';
import { HashRouter } from 'react-router-dom';
// import { ConnectAccountProvider } from '@augurproject/augur-comps';
import { AppStatusProvider, useAppStatusStore } from './stores/app-status';
import { UserProvider, useUserStore } from './stores/user';
import ModalView from './modal/modal-view';
import { ConnectAccountButton } from './shared/connect-account-button';
import {
  useUserBalances,
  useFinalizeUserTransactions,
  useUpdateApprovals,
} from './stores/utils';
import { PARA_CONFIG } from './stores/constants';
import { networkSettings } from './constants';
import { ErrorMessage, NetworkMismatchBanner } from './shared/error-message';
import { MigrationProvider, useMigrationStore } from './stores/migration-store';

const { ConnectAccountProvider } = ConnectAccount;

function checkIsMobile(setIsMobile) {
  const isMobile =
    (
      window.getComputedStyle(document.body).getPropertyValue('--is-mobile') ||
      ''
    ).indexOf('true') !== -1;
  setIsMobile(isMobile);
}

function useHandleResize() {
  const {
    actions: { setIsMobile },
  } = useAppStatusStore();
  useEffect(() => {
    const handleResize = () => checkIsMobile(setIsMobile);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
}

const AppBody = () => {
  const {
    isMobile,
    modal,
  } = useAppStatusStore();
  const {
    actions: { setTimestamp },
  } = useMigrationStore();
  const { txFailed, isMigrated } = useUserStore();
  const modalShowing = Object.keys(modal).length !== 0;

  useUserBalances();
  useFinalizeUserTransactions();
  useUpdateApprovals();
  useHandleResize();
  const { networkId } = PARA_CONFIG;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimestamp(Date.now() + 1);
    }, networkSettings[networkId].updateTime);
    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div id="mainContent" className={Styles.App}>
      {modalShowing && <ModalView />}
      <div>
        <Logo isMobile={isMobile} />
        <ConnectAccountButton />
      </div>
      <NetworkMismatchBanner />
      <span>Migrate V1 REP</span>
      <Migrate />
      {txFailed && <ErrorMessage type="error" message="Transaction Failed" />}
      {isMigrated && <ErrorMessage message="Migration Successful" />}
    </div>
  );
};

function App() {
  return (
    <HashRouter hashType="hashbang">
      <ConnectAccountProvider>
        <MigrationProvider>
          <UserProvider>
            <AppStatusProvider>
              <AppBody />
            </AppStatusProvider>
          </UserProvider>
        </MigrationProvider>
      </ConnectAccountProvider>
    </HashRouter>
  );
}

export default App;
