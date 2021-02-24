import React from 'react';
import logo from './logo.svg';
// import Styles from './App.styles.less';
import './assets/styles/shared.less';

import { LoadingMarketCard, MarketCard } from './components/market-card/market-card';

export const App = () => {
  return (
    <div>
      Market card:
      <MarketCard marketId={'0x0cc49229b93f87f97f657931b50c67af3f9b7845'} />
    </div>
  );
}

