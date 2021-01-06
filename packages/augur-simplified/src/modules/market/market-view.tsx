import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Styles from 'modules/market/market-view.styles.less';
import classNames from 'classnames';
import { UsdIcon, EthIcon } from 'modules/common/icons';
import SimpleChartSection from 'modules/common/charts';
import {
  AddLiquidity,
  CategoryIcon,
  CategoryLabel,
} from 'modules/common/labels';
import {
  PositionsLiquidityViewSwitcher,
  TransactionsTable,
} from '../common/tables';
import TradingForm, {
  fakeYesNoOutcomes,
  OutcomesGrid,
} from 'modules/market/trading-form';
import { useAppStatusStore } from 'modules/stores/app-status';
import {
  YES_NO,
  BUY,
  MARKET_ID_PARAM_NAME,
  ETH,
} from 'modules/constants';
import parseQuery from 'modules/routes/helpers/parse-query';
import { USDC } from '../constants';
import { AmmExchange, MarketInfo } from '../types';
import { formatDai } from '../../utils/format-number';

const getDetails = (market) => {
  const rawInfo = market?.extraInfoRaw || '{}';
  const { longDescription } = JSON.parse(rawInfo, (key, value) => {
    if (key === 'longDescription') {
      const processDesc = value.split('\n');
      return processDesc;
    } else {
      return value;
    }
  });
  return longDescription || [];
};

const useMarketQueryId = () => {
  const location = useLocation();
  const { [MARKET_ID_PARAM_NAME]: marketId } = parseQuery(location.search);
  return marketId;
};

const CurrencyLabel = ({ name }) => {
  let content = <>Add Liquidity</>;
  switch (name) {
    case ETH: {
      content = <>{EthIcon} ETH Market</>;
      break;
    }
    case USDC: {
      content = <>{UsdIcon} USDC Market</>;
      break;
    }
    default:
      break;
  }
  return <span className={Styles.CurrencyLabel}>{content}</span>;
};

const MarketView = ({ defaultMarket = null }) => {
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState(fakeYesNoOutcomes[0]);
  const marketId = useMarketQueryId();
  const {
    isMobile,
    showTradingForm,
    actions: { setShowTradingForm },
    processed: { markets },
  } = useAppStatusStore();

  useEffect(() => {
    // initial render only.
    document.getElementById("mainContent")?.scrollTo(0, 0);
    window.scrollTo(0, 1);
  }, []);
  const market: MarketInfo = !!defaultMarket ? defaultMarket : markets[marketId];
  const amm: AmmExchange = market?.amm;

  if (!market) return <div className={Styles.MarketView} />;
  const details = getDetails(market);
  const marketCashType = market.amm?.cash?.name;

  return (
    <div className={Styles.MarketView}>
      <section>
        <div className={Styles.topRow}>
          <CategoryIcon category={market.categories[0]} />
          <CategoryLabel category={market.categories[1]} />
          <CurrencyLabel name={amm?.cash?.name} />
        </div>
        <h1>{market.description}</h1>
        <ul className={Styles.StatsRow}>
          <li>
            <span>24hr Volume</span>
            <span>{formatDai(amm?.volume24hrTotalUSD || '0.00').full}</span>
          </li>
          <li>
            <span>Total Volume</span>
            <span>{formatDai(amm?.volumeTotalUSD || '0.00').full}</span>
          </li>
          <li>
            <span>Liquidity</span>
            <span>{formatDai(amm?.liquidityUSD || '0.00').full}</span>
          </li>
          <li>
            <span>Expires</span>
            <span>
              {new Date(Number(market.endTimestamp) * 1000).toDateString() ||
                'missing'}
            </span>
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
        <PositionsLiquidityViewSwitcher ammExchange={amm} />
        <div
          className={classNames(Styles.Details, {
            [Styles.isClosed]: !showMoreDetails,
          })}
        >
          <h4>Market Details</h4>
          {details.map((detail, i) => (
            <p key={`${detail.substring(5, 25)}-${i}`}>{detail}</p>
          ))}
          {details.length > 1 && (
            <button onClick={() => setShowMoreDetails(!showMoreDetails)}>
              {showMoreDetails ? 'Read Less' : 'Read More'}
            </button>
          )}
          {details.length === 0 && (
            <p>There are no additional details for this Market.</p>
          )}
        </div>
        <div className={Styles.TransactionsTable}>
          <span>Transactions</span>
          <TransactionsTable transactions={amm?.transactions}/>
        </div>
      </section>
      {(!isMobile || showTradingForm) && (
        <section>
          <TradingForm initialSelectedOutcome={selectedOutcome} market={market} marketCashType={marketCashType} amm={amm} />
          {!isMobile && <AddLiquidity market={market} />}
        </section>
      )}
    </div>
  );
};

export default MarketView;
