import React, { useEffect } from 'react';
import { ApolloProvider } from 'react-apollo';
import { client, getMarketsData } from 'modules/apollo/client';
import Styles from 'modules/App.styles.less';
import Routes from 'modules/routes/routes';
import TopNav from 'modules/common/top-nav';
import 'assets/styles/shared.less';
import {
  AppStatusProvider,
  useAppStatusStore,
} from 'modules/stores/app-status';
import { Sidebar } from 'modules/sidebar/sidebar';
import { processGraphMarkets } from '../utils/process-data';
import { getUserBalances } from '../utils/contract-calls';
import { augurSdkLite } from '../utils/augurlitesdk';
import { ConnectAccountProvider } from 'modules/ConnectAccount/connect-account-provider';
import { useActiveWeb3React } from 'modules/ConnectAccount/hooks';
import classNames from 'classnames';

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
    processed,
    paraConfig,
    isMobile,
    actions: {
      setIsMobile,
      updateGraphData,
      updateProcessed,
      updateUserBalances,
    },
  } = useAppStatusStore();
  const activeWeb3 = useActiveWeb3React();

  useEffect(() => {
    // get data immediately, then setup interval
    getMarketsData((data) => {
      updateGraphData(data);
      updateProcessed(processGraphMarkets(data));
    });
    let isMounted = true;
    const intervalId = setInterval(() => {
      getMarketsData((data) => {
        if (isMounted) {
          updateGraphData(data);
          updateProcessed(processGraphMarkets(data));
        }
      });
    }, 15000);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
    // eslint-disable-next-line
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
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (showTradingForm) {
      document.body.classList.add('App--noScroll');
      window.scrollTo(0, 0);
    } else {
      document.body.classList.remove('App--noScroll');
    }
  }, [showTradingForm]);

  useEffect(() => {
    const createClient = (provider, config) =>
      augurSdkLite.makeLiteClient(provider, config);
    const fetchUserBalances = (activeWeb3, ammExchanges, cashes) =>
      getUserBalances(
        activeWeb3?.library,
        activeWeb3?.account,
        ammExchanges,
        cashes
      );
    if (activeWeb3?.account && activeWeb3?.library) {
      if (!augurSdkLite.ready()) createClient(activeWeb3?.library, paraConfig);
      const { ammExchanges, cashes } = processed;
      fetchUserBalances(activeWeb3, ammExchanges, cashes).then((userBalances) =>
        updateUserBalances(userBalances)
      );
    }
    // eslint-disable-next-line
  }, [activeWeb3, processed, paraConfig]);
  const sidebarOut = sidebarType && isMobile;
  return (
    <div className={classNames(Styles.App, {
      [Styles.SidebarOut]: sidebarOut,
    })}>
      {sidebarOut && <Sidebar />}
      <TopNav />
      <Routes />
    </div>
  );
};

function App() {
  return (
    <ConnectAccountProvider>
      <ApolloProvider client={client}>
        <AppStatusProvider>
          <AppBody />
        </AppStatusProvider>
      </ApolloProvider>
    </ConnectAccountProvider>
  );
}

export default App;
