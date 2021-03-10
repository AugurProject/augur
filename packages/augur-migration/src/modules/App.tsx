import React, { useEffect } from 'react';
import classNames from 'classnames';

import '../assets/styles/shared.less';
import { Logo, Stores } from '@augurproject/augur-comps';
import Styles from './App.styles.less';
import { Migrate } from './migrate/migrate';
import { HashRouter } from 'react-router-dom';
import ModalView from './modal/modal-view';
import { ConnectAccountButton } from './shared/connect-account-button';
import {
  useUserBalances,
  useFinalizeUserTransactions,
  useUpdateApprovals,
  useRepMigrated,
} from './stores/utils';
import { PARA_CONFIG } from './stores/constants';
import { networkSettings } from './constants';
import { ErrorMessage, NetworkMismatchBanner } from './shared/error-message';
import { MigrationProvider, useMigrationStore } from './stores/migration-store';
import { MigrationIndicator } from './migrate/migration-indicator';
const {
  User: { UserProvider },
  ConnectAccount: { ConnectAccountProvider },
  AppStatus: { AppStatusProvider, useAppStatusStore },
} = Stores;

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
  const { isMobile, modal } = useAppStatusStore();
  const {
    actions: { setTimestamp },
  } = useMigrationStore();
  const { txFailed, isMigrated } = useMigrationStore();
  const modalShowing = Object.keys(modal).length !== 0;

  useUserBalances();
  useFinalizeUserTransactions();
  useUpdateApprovals();
  useHandleResize();
  useRepMigrated();

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
    <div
      id="mainContent"
      className={classNames(Styles.App, {
        [Styles.BannerShowing]: txFailed || isMigrated,
      })}
    >
      {modalShowing && <ModalView />}
      <div>
        <Logo isMobile={isMobile} />
        <ConnectAccountButton />
      </div>
      <NetworkMismatchBanner />
      <span>Migrate REP</span>
      <Migrate />
      {txFailed && <ErrorMessage type="error" message="Transaction Failed" />}
      {isMigrated && <ErrorMessage message="Migration Successful" />}
      <MigrationIndicator />
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
