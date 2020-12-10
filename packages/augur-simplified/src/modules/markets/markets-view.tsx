import React from 'react';
import Styles from 'modules/markets/markets-view.styles.less';
import makePath from 'modules/routes/helpers/make-path';
import { MARKET } from 'modules/constants';
import { Link } from 'react-router-dom';
import { ValueLabel, AppViewStats, CategoryLabel } from 'modules/common/labels';
import { formatDai } from 'utils/format-number';
import { EthIcon, PillIcon, UsdIcon } from 'modules/common/icons';
import classNames from 'classnames';
import { PrimaryButton } from 'modules/common/buttons';
import { SquareDropdown } from 'modules/common/selection';

const fakeMarketData = [
  {
    id: '0',
    category: 'Covid-19',
    description:
      "Will Pfizer's COVID-19 vaccine be the first to receive FDA approval or Emergency Use Authorization (EUA)?",
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
    id: '1',
    category: 'Us Politics',
    description: 'How many electoral college votes will be cast for Joe Biden?',
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
    id: '2',
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
    id: '3',
    category: 'Us Politics',
    inUsd: true,
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
    id: '4',
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
    id: '5',
    category: 'Us Politics',
    inUsd: true,
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
    id: '6',
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

const OutcomesTable = ({ outcomes }) => {
  return (
    <div className={Styles.OutcomesTable}>
      {outcomes.map((outcome) => (
        <div key={`${outcome.description}-${outcome.price}-${outcome.id}`}>
          <span>{outcome.description}</span>
          <span>{formatDai(outcome.price).full}</span>
        </div>
      ))}
    </div>
  );
};

const MarketCard = ({ market }) => {
  return (
    <article
      className={classNames(Styles.MarketCard, {
        [Styles.NoLiquidity]: market.noLiquidity,
      })}
    >
      <Link to={makePath(MARKET)}>
        <div>
          <div>{PillIcon}</div>
          <CategoryLabel category={market.category} />
          <div>{market.inUsd ? UsdIcon : EthIcon}</div>
          <span>{market.description}</span>
          {market.noLiquidity ? (
            <div>
              <span>Market requires Initial liquidity</span>
              <PrimaryButton text="Earn fees as a liquidity provider" />
            </div>
          ) : (
            <>
              <ValueLabel
                label="total volume"
                value={formatDai(market.volume).full}
              />
              <OutcomesTable outcomes={market.outcomes} />
            </>
          )}
        </div>
      </Link>
    </article>
  );
};

const MarketsView = () => {
  return (
    <div className={Styles.MarketsView}>
      <AppViewStats showCashAmounts />
      <ul>
        <SquareDropdown
          onChange={() => null}
          options={[{ label: 'Open', value: 0 }, { label: 'Closed', value: 1 }]}
          defaultValue='All Markets'
        />
         <SquareDropdown
          onChange={() => null}
          options={[{ label: 'Open', value: 0 }, { label: 'Closed', value: 1 }]}
          defaultValue='Volume'
        />
         <SquareDropdown
          onChange={() => null}
          options={[{ label: 'Open', value: 0 }, { label: 'Closed', value: 1 }]}
          defaultValue='Open'
        />
         <SquareDropdown
          onChange={() => null}
          options={[{ label: 'Open', value: 0 }, { label: 'Closed', value: 1 }]}
          defaultValue='All Currencies'
        />
      </ul>
      <section>
        {fakeMarketData.map((market) => (
          <MarketCard key={market.id} market={market} />
        ))}
      </section>
    </div>
  );
};

export default MarketsView;
