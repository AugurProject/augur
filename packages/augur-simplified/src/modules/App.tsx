import React, { useEffect } from 'react';
import { ApolloProvider } from 'react-apollo';
import { useLocation } from 'react-router';
import { HashRouter } from 'react-router-dom';
import Styles from './App.styles.less';
import Routes from './routes/routes';
import TopNav from './common/top-nav';
import '../assets/styles/shared.less';
import { SimplifiedProvider, useSimplifiedStore } from './stores/simplified';
import { Sidebar } from './sidebar/sidebar';
import classNames from 'classnames';
import ModalView from './modal/modal-view';
import { usePageView } from '../utils/tracker';
import {
  Stores,
  useUserStore,
  useAppStatusStore,
  useGraphHeartbeat,
  useFinalizeUserTransactions,
  useUserBalances,
  GraphClient,
  PathUtils,
  Constants,
} from '@augurproject/augur-comps';
const { MARKETS } = Constants;
const { parsePath } = PathUtils;

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
  const { sidebarType, showTradingForm } = useSimplifiedStore();
  const { loginAccount } = useUserStore();
  const modalShowing = Object.keys(modal).length !== 0;
  const location = useLocation();
  const path = parsePath(location.pathname)[0];
  const sidebarOut = sidebarType && isMobile;

  useGraphHeartbeat(loginAccount ? loginAccount.library : null);
  useUserBalances();
  useFinalizeUserTransactions();

  useHandleResize();
  usePageView();

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
        [Styles.ModalShowing]: modalShowing || showTradingForm,
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
    AppStatus: { AppStatusProvider },
    ConnectAccount: { ConnectAccountProvider },
    GraphData: { GraphDataProvider },
    User: { UserProvider },
  } = Stores;
  return (
    <HashRouter hashType="hashbang">
      <ConnectAccountProvider>
        <ApolloProvider client={GraphClient.client}>
          <GraphDataProvider>
            <UserProvider>
              <AppStatusProvider>
                <SimplifiedProvider>
                  <AppBody />
                </SimplifiedProvider>
              </AppStatusProvider>
            </UserProvider>
          </GraphDataProvider>
        </ApolloProvider>
      </ConnectAccountProvider>
    </HashRouter>
  );
}

export default App;
