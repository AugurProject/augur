import React from 'react';
import Styles from 'modules/markets/markets-view.styles.less';
import makePath from 'modules/routes/helpers/make-path';
import { MARKET } from 'modules/constants';
import { Link } from 'react-router-dom';
import { ValueLabel } from 'modules/common/labels';
import { formatDai } from 'utils/format-number';

const fakeMarketData = [
  {
    category: 'Covid-19',
    description: "Will Pfizer's thing happen?",
    volume: 350019,
    outcomes: [
      {
        description: 'yes',
        price: 0.75,
      },
      {
        description: 'no',
        price: 0.25,
      },
    ],
  },
  {
    category: 'Us Politics',
    description: 'How many electoral college votes?',
    volume: 350019,
    outcomes: [
      {
        description: '306',
        price: 0.75,
      },
      {
        description: '303 - 305',
        price: 0.25,
      },
    ],
  },
  {
    category: 'Covid-19',
    description: "Will Pfizer's thing happen?",
    volume: 350019,
    outcomes: [
      {
        description: 'yes',
        price: 0.75,
      },
      {
        description: 'no',
        price: 0.25,
      },
    ],
  },
  {
    category: 'Us Politics',
    description: 'How many electoral college votes?',
    volume: 350019,
    outcomes: [
      {
        description: '306',
        price: 0.75,
      },
      {
        description: '303 - 305',
        price: 0.25,
      },
    ],
  },
  {
    category: 'Covid-19',
    description: "Will Pfizer's thing happen?",
    volume: 350019,
    outcomes: [
      {
        description: 'yes',
        price: 0.75,
      },
      {
        description: 'no',
        price: 0.25,
      },
    ],
  },
  {
    category: 'Us Politics',
    description: 'How many electoral college votes?',
    volume: 350019,
    outcomes: [
      {
        description: '306',
        price: 0.75,
      },
      {
        description: '303 - 305',
        price: 0.25,
      },
    ],
  },
  {
    category: 'Us Politics',
    description: 'How many electoral college votes?',
    volume: 0,
    noLiquidity: true,
    outcomes: [
      {
        description: '306',
        price: 0,
      },
      {
        description: '303 - 305',
        price: 0,
      },
    ],
  },
];

const fakeMarketViewStats = {
  totalAccountValue: 15571.58,
  positions: {
    hourChange: 56.29,
    value: 5045
  },
  availableFunds: 10526.58,
  daiAmount: 526.58,
  cashAmount: 5000
}

const MarketViewStats = () => {
  return (
    <div className={Styles.MarketViewStats}>
      <ValueLabel large label={'total account value'} value={formatDai(fakeMarketViewStats.totalAccountValue).full} />
      <ValueLabel large label={'positions'} value={formatDai(fakeMarketViewStats.positions.value).full} />
      <ValueLabel large label={'available funds'} value={formatDai(fakeMarketViewStats.availableFunds).full} />
      <ValueLabel icon value={formatDai(fakeMarketViewStats.daiAmount).full} />
      <ValueLabel icon value={formatDai(fakeMarketViewStats.cashAmount).full} />
    </div>
  )
}


const MarketCard = ({market}) => {
  return (
    <article>
      <Link to={makePath(MARKET)}>
        <div className={Styles.MarketCard}>
          <div>
            icon
          </div>
          <div>
            {market.category}
          </div>
          <div>
            icon
          </div>
          {market.description}
          {market.noLiquidity ?
            <div>
              <span>Market requires Initial liquidity</span>
              <span>Earn fees as a liquidity provider</span>
              <button>Add liquidity</button>
            </div> 
          :
          <>
            <ValueLabel label={'total volume'} value={formatDai(market.volume).full} />
            <div>
              {market.outcomes.map(outcome => 
                <div>
                  <span>{outcome.description}</span>
                  <span>{formatDai(outcome.price).full}</span>
                </div>
              )}
            </div>
          </>
          }
        </div>
      </Link>
    </article>
  );
};

const MarketsView = () => {
  return (
    <div className={Styles.MarketsView}>
      <MarketViewStats />
      <ul>
        <li>filter dropdown</li>
        <li>filter dropdown</li>
        <li>filter dropdown</li>
        <li>filter dropdown</li>
      </ul>
      <section>
        {fakeMarketData.map(market => <MarketCard market={market} />)}
      </section>
    </div>
  );
};

export default MarketsView;
