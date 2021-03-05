import React, { useEffect } from 'react';
import { ApolloProvider } from 'react-apollo';
import { client } from './apollo/client';
import { useLocation } from 'react-router';
import { HashRouter } from 'react-router-dom';
import Styles from './App.styles.less';
import Routes from './routes/routes';
import TopNav from './common/top-nav';
import '../assets/styles/shared.less';
import { AppStatusProvider, useAppStatusStore } from './stores/app-status';
import { UserProvider, useUserStore } from './stores/user';
import { Sidebar } from './sidebar/sidebar';
import classNames from 'classnames';
import ModalView from './modal/modal-view';
import parsePath from './routes/helpers/parse-path';
import { MARKETS } from './constants';
import { useUserBalances, useFinalizeUserTransactions } from './stores/utils';
import { Stores, useGraphHeartbeat, ConnectAccount } from '@augurproject/augur-comps';

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
    sidebarType,
    showTradingForm,
    isMobile,
    modal,
  } = useAppStatusStore();
  const {
    loginAccount,
  } = useUserStore();
  const modalShowing = Object.keys(modal).length !== 0;
  const location = useLocation();
  const path = parsePath(location.pathname)[0];
  const sidebarOut = sidebarType && isMobile;
  
  useGraphHeartbeat(loginAccount ? loginAccount.library : null);
  useUserBalances();
  useFinalizeUserTransactions();

  useHandleResize();

  useEffect(() => {
    if (showTradingForm) {
      window.scrollTo(0, 1);
    }
  }, [showTradingForm, modalShowing, sidebarOut]);

  return (
    <div
      id="mainContent"
      className={classNames(Styles.App, {
        [Styles.SidebarOut]: sidebarOut,
        [Styles.TwoToneContent]: path !== MARKETS,
        [Styles.ModalShowing]: modalShowing || showTradingForm
      })}
    >
      {modalShowing && <ModalView />}
      {sidebarOut && <Sidebar />}
      <TopNav />
      <Routes />
    </div>
  );
};

function App() {
  const {
    GraphData: {
      GraphDataProvider
    },
  } = Stores;
  return (
    <HashRouter hashType="hashbang">
      <ConnectAccountProvider>
        <ApolloProvider client={client}>
          <GraphDataProvider>
            <UserProvider>
              <AppStatusProvider>
                <AppBody />
              </AppStatusProvider>
            </UserProvider>
          </GraphDataProvider>
        </ApolloProvider>
      </ConnectAccountProvider>
    </HashRouter>
  );
}

export default App;
