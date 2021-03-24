import React, { useEffect } from 'react';
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
  useGraphDataStore,
  useAppStatusStore,
  useFinalizeUserTransactions,
  useUserBalances,
  PathUtils,
  Constants,
  windowRef,
} from '@augurproject/augur-comps';
const { MARKETS } = Constants;
const { parsePath } = PathUtils;

const AppBody = () => {
  const { markets, cashes, ammExchanges, blocknumber } = useGraphDataStore();
  const { isMobile, modal } = useAppStatusStore();
  const { sidebarType, showTradingForm } = useSimplifiedStore();
  const modalShowing = Object.keys(modal).length !== 0;
  const location = useLocation();
  const path = parsePath(location.pathname)[0];
  const sidebarOut = sidebarType && isMobile;

  useUserBalances(ammExchanges, cashes, markets);
  useFinalizeUserTransactions(blocknumber);
  usePageView();

  useEffect(() => {
    const html = windowRef.document.firstElementChild;
    const isHeightUnset = html.style.height === '';
    const eitherOr = (modalShowing || showTradingForm);
    if (eitherOr && isHeightUnset) {
      console.log(1);
      html.style.height = '100%';
      html.style.overflow = 'hidden';
    } else if (!eitherOr && !isHeightUnset) {
      console.log(2);
      html.style.height = '';
      html.style.overflow = '';
    }
  }, [modalShowing, showTradingForm]);
  
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
        <GraphDataProvider>
          <UserProvider>
            <AppStatusProvider>
              <SimplifiedProvider>
                <AppBody />
              </SimplifiedProvider>
            </AppStatusProvider>
          </UserProvider>
        </GraphDataProvider>
      </ConnectAccountProvider>
    </HashRouter>
  );
}

export default App;
