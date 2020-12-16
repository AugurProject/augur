import React, { useEffect } from 'react';
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
    actions: { setIsMobile },
  } = useAppStatusStore();

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


  useEffect(() => {
    if (
      filterSidebar
    ) {
      document.body.classList.add('App--noScroll');
    } else {
      document.body.classList.remove('App--noScroll');
    }
  }, [filterSidebar]);


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
    <AppStatusProvider>
      <AppBody />
    </AppStatusProvider>
  );
}

export default App;
