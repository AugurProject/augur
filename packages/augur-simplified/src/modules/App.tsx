import React, { useEffect } from 'react';
import { ApolloProvider } from 'react-apollo';
import { client, getMarketsData } from './apollo/client';
import { useLocation } from 'react-router';
import { HashRouter } from 'react-router-dom';
import Styles from './App.styles.less';
import Routes from './routes/routes';
import TopNav from './common/top-nav';
import '../assets/styles/shared.less';
import { AppStatusProvider, useAppStatusStore } from './stores/app-status';
import { GraphDataProvider, useGraphDataStore } from './stores/graph-data';
import { UserProvider, useUserStore } from './stores/user';
import { Sidebar } from './sidebar/sidebar';
import { processGraphMarkets } from '../utils/process-data';
import { getUserBalances } from '../utils/contract-calls';
import { augurSdkLite } from '../utils/augurlitesdk';
import { ConnectAccountProvider } from './ConnectAccount/connect-account-provider';
import classNames from 'classnames';
import { TransactionDetails } from './types';
import ModalView from './modal/modal-view';
import parsePath from './routes/helpers/parse-path';
import { MARKETS } from './constants';
import { PARA_CONFIG } from './stores/constants';

function checkIsMobile(setIsMobile) {
  const isMobile =
    (
      window.getComputedStyle(document.body).getPropertyValue('--is-mobile') ||
      ''
    ).indexOf('true') !== -1;
  setIsMobile(isMobile);
}

const AppBody = () => {
  const {
    sidebarType,
    showTradingForm,
    isMobile,
    modal,
    actions: { setIsMobile },
  } = useAppStatusStore();
  const {
    loginAccount,
    transactions,
    actions: { updateUserBalances, finalizeTransaction },
  } = useUserStore();
  const {
    blocknumber,
    ammExchanges,
    cashes,
    markets,
    actions: { updateGraphHeartbeat },
  } = useGraphDataStore();
  const modalShowing = Object.keys(modal).length !== 0;
  const location = useLocation();
  const path = parsePath(location.pathname)[0];

  useEffect(() => {
    let isMounted = true;
    // get data immediately, then setup interval
    getMarketsData((graphData, block, errors) => {
      isMounted && !!errors
        ? updateGraphHeartbeat(
            { ammExchanges, cashes, markets },
            blocknumber,
            errors
          )
        : updateGraphHeartbeat(processGraphMarkets(graphData), block, errors);
    });
    const intervalId = setInterval(() => {
      getMarketsData((graphData, block, errors) => {
        isMounted && !!errors
          ? updateGraphHeartbeat(
              { ammExchanges, cashes, markets },
              blocknumber,
              errors
            )
          : updateGraphHeartbeat(processGraphMarkets(graphData), block, errors);
      });
    }, 15000);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    function handleRezize() {
      checkIsMobile(setIsMobile);
    }
    window.addEventListener('resize', handleRezize);
    checkIsMobile(setIsMobile);
    return () => {
      window.removeEventListener('resize', handleRezize);
    };
  }, []);

  const sidebarOut = sidebarType && isMobile;
  useEffect(() => {
    if (showTradingForm) {
      window.scrollTo(0, 1);
    }
  }, [showTradingForm, modalShowing, sidebarOut]);

  useEffect(() => {
    let isMounted = true;
    const createClient = (provider, config, account) =>
      augurSdkLite.makeLiteClient(provider, config, account);
    const fetchUserBalances = (
      library,
      account,
      ammExchanges,
      cashes,
      markets
    ) => getUserBalances(library, account, ammExchanges, cashes, markets);
    if (loginAccount?.library && loginAccount?.account) {
      if (!augurSdkLite.ready())
        createClient(loginAccount.library, PARA_CONFIG, loginAccount?.account);
      fetchUserBalances(
        loginAccount.library,
        loginAccount.account,
        ammExchanges,
        cashes,
        markets
      ).then((userBalances) => isMounted && updateUserBalances(userBalances));
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, [
    loginAccount?.account,
    loginAccount?.library,
    ammExchanges,
    cashes,
    markets,
    PARA_CONFIG,
  ]);

  useEffect(() => {
    if (loginAccount?.account && blocknumber && transactions?.length > 0) {
      transactions
        .filter((t) => !t.confirmedTime)
        .forEach((t: TransactionDetails) => {
          loginAccount.library.getTransactionReceipt(t.hash).then((receipt) => {
            if (receipt) finalizeTransaction(t.hash);
          });
        });
    }
  }, [loginAccount, blocknumber, transactions]);

  return (
    <div
      id="mainContent"
      className={classNames(Styles.App, {
        [Styles.SidebarOut]: sidebarOut,
        [Styles.TwoToneContent]: path !== MARKETS,
        [Styles.ModalShowing]: modalShowing
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
