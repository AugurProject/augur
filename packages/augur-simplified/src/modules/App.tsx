import React from 'react';
// @ts-ignore
import * as Styles from 'modules/App.styles.less';
import Routes from 'modules/routes/routes';
import TopNav from 'modules/common/top-nav';

function App() {
  return (
    <div className={Styles.App}>
      <TopNav />
      <Routes />
    </div>
  );
}

export default App;
