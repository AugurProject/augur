import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { HashRouter } from 'react-router-dom';
import Styles from './App.styles.less';
import '../assets/styles/shared.less';
import { AppStatusProvider, useAppStatusStore } from './stores/app-status';
import { UserProvider } from './stores/user';
import { ConnectAccountProvider } from './ConnectAccount/connect-account-provider';
import classNames from 'classnames';
import parsePath from './routes/helpers/parse-path';
import { useGraphHeartbeat, useUserBalances, useFinalizeUserTransactions } from './stores/utils';

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
    sidebarType,
    showTradingForm,
    isMobile,
    modal,
  } = useAppStatusStore();
  const modalShowing = Object.keys(modal).length !== 0;
  const location = useLocation();

  useGraphHeartbeat();
  useUserBalances();
  useFinalizeUserTransactions();

  useHandleResize();

  useEffect(() => {
    if (showTradingForm) {
      window.scrollTo(0, 1);
    }
  }, [modalShowing]);

  return (
    <div
      id="mainContent"
      className={classNames(Styles.App, {
        [Styles.ModalShowing]: modalShowing || showTradingForm
      })}
    >
      Migrating App
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
