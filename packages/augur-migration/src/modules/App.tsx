import React from 'react';
import '../assets/styles/shared.less';
import { Logo, PrimaryButton } from '@augurproject/augur-comps';
import Styles from './App.styles.less';
import { Migrate } from './migrate/migrate';

const AppBody = () => {
  return (
    <div id="mainContent" className={Styles.App}>
      <Logo darkTheme/>
      <PrimaryButton text='Connect' darkTheme />
      <span>Migrate V1 REP</span>
      <Migrate />
    </div>
  );
};

function App() {
  return (
    <AppBody />
  );
}

export default App;
