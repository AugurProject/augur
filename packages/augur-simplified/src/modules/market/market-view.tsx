import React, { useState } from 'react';
import Styles from 'modules/market/market-view.styles.less';
import { formatDai } from 'utils/format-number';
import classNames from 'classnames';
import { createBigNumber } from 'utils/create-big-number';
import { UsdIcon } from 'modules/common/icons';
import SimpleChartSection from 'modules/common/charts';
import { AddLiquidity, CategoryIcon, CategoryLabel } from 'modules/common/labels';
import { COVID, MEDICAL } from 'modules/constants';
import { PositionsLiquidityViewSwitcher, TransactionsTable } from 'modules/common/tables';
import TradingForm from 'modules/market/trading-form';

const MARKET_DATA = {
  id: '0xdeadbeef',
  description:
    "Will Pfizer's COVID-19 vaccine be the first to receive FDA approval or Emergency Use Authorization (EUA)?",
  minPrice: 0,
  maxPrice: 1,
  minPriceBigNumber: createBigNumber(0),
  maxPriceBigNumber: createBigNumber(1),
  expirationDate: 'July 31, 2021',
  categories: [MEDICAL, COVID, 'vaccine'],
  totalLiquidity: formatDai(createBigNumber(83375)),
  twentyFourHourVolume: formatDai(createBigNumber(12027)),
  totalVolume: formatDai(createBigNumber(350019)),
  details: [
    'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  ],
  outcomes: [
    { id: 0, label: 'Invalid', value: 'invalid', lastPrice: '0' },
    { id: 1, label: 'Yes', value: 'yes', lastPrice: '0.75' },
    { id: 2, label: 'No', value: 'no', lastPrice: '0.25' },
  ],
  settlementFee: '0.1',
  marketCurrency: 'USDC',
};

const MarketView = ({ market = MARKET_DATA }) => {
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  return (
    <div className={Styles.MarketView}>
      <section>
        <div className={Styles.topRow}>
          <CategoryIcon category={market.categories[0]} />
          <CategoryLabel category={market.categories[1]} />
          <span className={Styles.CurrencyLabel}>{UsdIcon} USDC Market</span>
        </div>
        <h1>{market.description}</h1>
        <ul className={Styles.StatsRow}>
          <li>
            <span>24hr Volume</span>
            <span>{market.twentyFourHourVolume.full}</span>
          </li>
          <li>
            <span>Total Volume</span>
            <span>{market.totalVolume.full}</span>
          </li>
          <li>
            <span>Liquidity</span>
            <span>{market.totalLiquidity.full}</span>
          </li>
          <li>
            <span>Expires</span>
            <span>{market.expirationDate}</span>
          </li>
        </ul>
        <SimpleChartSection {...{ market }} />
        <PositionsLiquidityViewSwitcher marketId={market.id} />
        <div
          className={classNames(Styles.Details, {
            [Styles.isClosed]: !showMoreDetails,
          })}
        >
          <h4>Market Details</h4>
          {market.details.map((detail, i) => (
            <p key={`${detail.substring(5, 25)}-${i}`}>{detail}</p>
          ))}
          {market.details.length > 1 && (
            <button onClick={() => setShowMoreDetails(!showMoreDetails)}>
              {showMoreDetails ? 'Read Less' : 'Read More'}
            </button>
          )}
        </div>
        <div className={Styles.TransactionsTable}>
          <span>
            Transactions
          </span>
          <TransactionsTable />
        </div>
      </section>
      <section>
        <TradingForm />
        <AddLiquidity />
      </section>
    </div>
  );
};

export default MarketView;
