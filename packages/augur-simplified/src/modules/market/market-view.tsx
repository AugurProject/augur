import React, { useState } from 'react';
import Styles from 'modules/market/market-view.styles.less';
import classNames from 'classnames';
import { UsdIcon } from 'modules/common/icons';
import SimpleChartSection from 'modules/common/charts';
import {
  AddLiquidity,
  CategoryIcon,
  CategoryLabel,
} from 'modules/common/labels';
import {
  PositionsLiquidityViewSwitcher,
  TransactionsTable,
} from 'modules/common/tables';
import TradingForm, {
  fakeYesNoOutcomes,
  OutcomesGrid,
} from 'modules/market/trading-form';
import { useAppStatusStore } from 'modules/stores/app-status';
import { YES_NO, BUY } from 'modules/constants';

const MarketView = ({ defaultMarket = null }) => {
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState(fakeYesNoOutcomes[0]);

  const {
    marketInfos,
    isMobile,
    showTradingForm,
    actions: { setShowTradingForm },
  } = useAppStatusStore();
  const market = !!defaultMarket ? defaultMarket : marketInfos['0xdeadbeef'];

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
        {isMobile && (
          <OutcomesGrid
            outcomes={fakeYesNoOutcomes}
            selectedOutcome={fakeYesNoOutcomes[0]}
            showAllHighlighted
            setSelectedOutcome={(outcome) => {
              setSelectedOutcome(outcome);
              setShowTradingForm(true);
            }}
            marketType={YES_NO}
            orderType={BUY}
          />
        )}
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
          <span>Transactions</span>
          <TransactionsTable />
        </div>
      </section>
      {(!isMobile || showTradingForm) && (
        <section>
          <TradingForm initialSelectedOutcome={selectedOutcome} />
          {!isMobile && <AddLiquidity />}
        </section>
      )}
    </div>
  );
};

export default MarketView;
