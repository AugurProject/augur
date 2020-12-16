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
    filterSidebar,
    actions: { setIsMobile, updateGraphData },
  } = useAppStatusStore();

  useEffect(() => {
    getMarketsData(updateGraphData);
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

  return (
    <div className={Styles.App}>
      {filterSidebar && <Sidebar />}
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
