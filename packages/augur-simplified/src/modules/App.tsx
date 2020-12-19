import React, { useEffect } from 'react';
import { ApolloProvider } from 'react-apollo'
import { client, getMarketsData } from 'modules/apollo/client'
import Styles from 'modules/App.styles.less';
import Routes from 'modules/routes/routes';
import TopNav from 'modules/common/top-nav';
import 'assets/styles/shared.less';
import {
  AppStatusProvider,
  useAppStatusStore,
} from 'modules/stores/app-status';
import { Sidebar } from 'modules/sidebar/sidebar';
import { processGraphMarkets } from 'utils/process-data';

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
    actions: { setIsMobile, updateGraphData },
  } = useAppStatusStore();

  useEffect(() => {
    // get data immediately, then setup interval
    getMarketsData((data) => {
      updateGraphData(data);
      processGraphMarkets(data);
    });
    let isMounted = true;
    const intervalId = setInterval(() => {
      getMarketsData((data) => {
        if (isMounted) {
          updateGraphData(data);
          processGraphMarkets(data);
        }
      });
    }, 15000);
    return (() => {
      isMounted = false;
      clearInterval(intervalId);
    })
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
    if (
      sidebarType || showTradingForm
    ) {
      document.body.classList.add('App--noScroll');
      window.scrollTo(0, 0);
    } else {
      document.body.classList.remove('App--noScroll');
    }
  }, [sidebarType, showTradingForm]);


  return (
    <div className={Styles.App}>
      {sidebarType && <Sidebar />}
      <TopNav />
      <Routes />
    </div>
  );
};

function App() {
  return (
    <ApolloProvider client={client}>
      <AppStatusProvider>
        <AppBody />
      </AppStatusProvider>
    </ApolloProvider>
  );
}

export default App;
