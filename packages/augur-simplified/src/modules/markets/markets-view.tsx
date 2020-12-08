import React from 'react';
import * as Styles from 'modules/markets/markets-view.styles.less';
import makePath from 'modules/routes/helpers/make-path';
import { MARKET } from 'modules/constants';
import { Link } from 'react-router-dom';

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

const MarketCard = ({market}) => {
  return (
    <article>
      <Link to={makePath(MARKET)}>
        <div>
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
            <div>
              <span>total volume</span>
              <span>market.volume</span>
            </div>
            <div>
              {market.outcomes.map(outcome => 
                <div>
                  <span>{outcome.description}</span>
                  <span>{outcome.price}</span>
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
    <div className={Styles.MarketView}>
      <div>Markets View Stats Section Box thing</div>
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
