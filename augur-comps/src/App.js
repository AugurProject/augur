import logo from './logo.svg';
import './App.css';

import { LoadingMarketCard, MarketCard } from './components/market-card/market-card';

function App() {
  return (
    <div className="App">
      Market card:
      <MarketCard marketId={'0x0cc49229b93f87f97f657931b50c67af3f9b7845'} />
    </div>
  );
}

export default App;
