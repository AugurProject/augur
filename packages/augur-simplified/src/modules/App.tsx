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
} from './stores/app-status';
import { Sidebar } from 'modules/sidebar/sidebar';
import { processGraphMarkets } from '../utils/process-data';
import { getUserBalances } from '../utils/contract-calls';
import { augurSdkLite } from '../utils/augurlitesdk';
import { ConnectAccountProvider } from 'modules/ConnectAccount/connect-account-provider';
import { useActiveWeb3React } from 'modules/ConnectAccount/hooks';
import classNames from 'classnames';
import { TransactionDetails } from './types';

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
    blocknumber,
    transactions,
    actions: {
      setIsMobile,
      updateGraphData,
      updateProcessed,
      updateUserBalances,
      updateBlocknumber,
      finalizeTransaction,
    },
  } = useAppStatusStore();
  const { account, library } = useActiveWeb3React();

  useEffect(() => {
    // get data immediately, then setup interval
    getMarketsData(paraConfig, updateBlocknumber, (data) => {
      updateGraphData(data);
      updateProcessed(processGraphMarkets(data));
    });
    let isMounted = true;
    const intervalId = setInterval(() => {
      getMarketsData(paraConfig, updateBlocknumber, (data) => {
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
    const fetchUserBalances = (library, account, ammExchanges, cashes, markets) =>
      getUserBalances(
        library,
        account,
        ammExchanges,
        cashes,
        markets
      );
    if (account && library) {
      if (!augurSdkLite.ready()) createClient(library, paraConfig);
      const { ammExchanges, cashes, markets } = processed;
      fetchUserBalances(library, account, ammExchanges, cashes, markets).then((userBalances) =>
        updateUserBalances(userBalances)
      );
    }
  // eslint-disable-next-line
  }, [account, library, processed, paraConfig]);

  useEffect(() => {
    if (account && blocknumber && transactions?.length > 0) {
      transactions.filter(t => !t.confirmedTime)
        .forEach((t: TransactionDetails) => {
          library
            .getTransactionReceipt(t.hash)
            .then(receipt => {
              if (receipt) finalizeTransaction(t.hash)
            })
        })
    }
  // eslint-disable-next-line
  }, [account, blocknumber, transactions]);

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
