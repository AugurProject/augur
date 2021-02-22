import logo from './logo.svg';
import './App.css';

import { LoadingMarketCard, MarketCard } from './components/market-card/market-card';

function App() {
  return (
    <div className="App">
      Loading market card:
      <LoadingMarketCard />
      Market card:
      <MarketCard />
    </div>
  );
}

export default App;
