import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router';
import Styles from './market-view.styles.less';
import classNames from 'classnames';
import SimpleChartSection from '../common/charts';
import {
  AddLiquidity,
  CategoryIcon,
  CategoryLabel,
  NetworkMismatchBanner,
  CurrencyLabel,
  AddCurrencyLiquidity,
  ReportingStateLabel,
  InvalidFlagTipIcon,
} from '../common/labels';
import {
  PositionsLiquidityViewSwitcher,
  TransactionsTable,
} from '../common/tables';
import TradingForm from './trading-form';
import { AmmExchange, MarketInfo } from '../types';
import {
  Icons,
  Constants,
  useAppStatusStore,
  useGraphDataStore,
  useScrollToTopOnMount,
  SEO,
  Stores,
  Utils,
  ButtonComps,
} from '@augurproject/augur-comps';
import { OutcomesGrid } from '../common/inputs';
import { AmmOutcome, MarketOutcome } from '../types';
import { MARKETS_LIST_HEAD_TAGS } from '../seo-config';
import { useSimplifiedStore } from '../stores/simplified';
const { ConfirmedCheck } = Icons;
const { BuySellButton } = ButtonComps;
const {
  MARKET_STATUS,
  USDC,
  YES_NO,
  BUY,
  MARKET_ID_PARAM_NAME,
  ETH,
  DefaultMarketOutcomes,
} = Constants;
const {
  Utils: { getCurrentAmms },
} = Stores;
const {
  DateUtils: { getMarketEndtimeDate, getMarketEndtimeFull },
  Formatter: { formatDai },
  PathUtils: { parseQuery },
} = Utils;

export const combineOutcomeData = (
  ammOutcomes: AmmOutcome[],
  marketOutcomes: MarketOutcome[]
) => {
  if (!ammOutcomes || ammOutcomes.length === 0) return [];
  return marketOutcomes.map((mOutcome, index) => ({
    ...mOutcome,
    ...ammOutcomes[index],
  }));
};

export const getWinningOutcome = (
  ammOutcomes: AmmOutcome[],
  marketOutcomes: MarketOutcome[]
) =>
  combineOutcomeData(ammOutcomes, marketOutcomes).filter(
    ({ payoutNumerator }) => payoutNumerator !== null && payoutNumerator !== '0'
  );

const WinningOutcomeLabel = ({ winningOutcome }) => (
  <span className={Styles.WinningOutcomeLabel}>
    <span>Winning Outcome</span>
    <span>
      {winningOutcome.name}
      {ConfirmedCheck}
    </span>
  </span>
);

const getDetails = (market) => {
  const rawInfo = market?.extraInfoRaw || '{}';
  const { longDescription } = JSON.parse(rawInfo, (key, value) => {
    if (key === 'longDescription') {
      // added to handle edge case were details are defined as an empty string.
      const processDesc = value?.length !== 0 ? value.split('\n') : [];
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

const EmptyMarketView = () => {
  return (
    <div className={classNames(Styles.MarketView, Styles.EmptyMarketView)}>
      <section>
        <section>
          <div />
          <div />
          <div />
        </section>
        <section>
          <div />
          <div />
          <div />
        </section>
        <section>
          <div />
          <div />
          <div />
          <div />
        </section>
        <section>
          <div />
          <div />
          <div />
          <div />
        </section>
        <section>
          <div />
        </section>
      </section>
      <section>
        <div />
        <div />
        <div />
      </section>
    </div>
  );
};

const MarketView = ({ defaultMarket = null }) => {
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const marketId = useMarketQueryId();
  const { isMobile } = useAppStatusStore();
  const {
    showTradingForm,
    actions: { setShowTradingForm },
  } = useSimplifiedStore();
  const { markets } = useGraphDataStore();

  useScrollToTopOnMount();

  const market: MarketInfo = !!defaultMarket
    ? defaultMarket
    : markets[marketId];
  const endTimeDate = useMemo(
    () => getMarketEndtimeDate(market?.endTimestamp),
    [market?.endTimestamp]
  );
  const selectedOutcome = market
    ? market.outcomes[2]
    : DefaultMarketOutcomes[2];
  // add end time data full to market details when design is ready
  const endTimeDateFull = useMemo(
    () => getMarketEndtimeFull(market?.endTimestamp),
    [market?.endTimestamp]
  );
  const amm: AmmExchange = market?.amm;

  if (!market) return <EmptyMarketView />;
  const details = getDetails(market);
  const currentAMMs = getCurrentAmms(market, markets);
  const { reportingState, outcomes } = market;
  const winningOutcomes = getWinningOutcome(amm?.ammOutcomes, outcomes);
  return (
    <div className={Styles.MarketView}>
      <SEO
        {...MARKETS_LIST_HEAD_TAGS}
        title={market.description}
        ogTitle={market.description}
        twitterTitle={market.description}
      />
      <section>
        <NetworkMismatchBanner />
        {isMobile && <ReportingStateLabel {...{ reportingState, big: true }} />}
        <div className={Styles.topRow}>
          <CategoryIcon big categories={market.categories} />
          <CategoryLabel big categories={market.categories} />
          {!isMobile && (
            <ReportingStateLabel {...{ reportingState, big: true }} />
          )}
          <InvalidFlagTipIcon {...{ market, big: true }} />
          <CurrencyLabel name={amm?.cash?.name} />
        </div>
        <h1>{market.description}</h1>
        {reportingState === MARKET_STATUS.FINALIZED &&
          winningOutcomes.length > 0 && (
            <WinningOutcomeLabel winningOutcome={winningOutcomes[0]} />
          )}
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
            <span>{endTimeDate}</span>
          </li>
        </ul>
        <OutcomesGrid
          outcomes={amm?.ammOutcomes}
          selectedOutcome={amm?.ammOutcomes[2]}
          showAllHighlighted
          setSelectedOutcome={() => null}
          marketType={YES_NO}
          orderType={BUY}
          ammCash={amm?.cash}
        />
        <SimpleChartSection {...{ market, cash: amm?.cash }} />
        <PositionsLiquidityViewSwitcher ammExchange={amm} />
        <article className={Styles.MobileLiquidSection}>
          <AddLiquidity market={market} />
          {currentAMMs.length === 1 && (
            <AddCurrencyLiquidity
              market={market}
              currency={currentAMMs[0] === USDC ? ETH : USDC}
            />
          )}
        </article>
        <div
          className={classNames(Styles.Details, {
            [Styles.isClosed]: !showMoreDetails,
          })}
        >
          <h4>Market Details</h4>
          <h5>Market Expiration: {endTimeDateFull}</h5>
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
          <TransactionsTable transactions={amm?.transactions} />
        </div>
        <BuySellButton
          text="Buy / Sell"
          action={() => setShowTradingForm(true)}
        />
      </section>
      <section
        className={classNames({
          [Styles.ShowTradingForm]: showTradingForm,
        })}
      >
        <TradingForm initialSelectedOutcome={selectedOutcome} amm={amm} />
        <AddLiquidity market={market} />
        {currentAMMs.length === 1 && (
          <AddCurrencyLiquidity
            market={market}
            currency={currentAMMs[0] === USDC ? ETH : USDC}
          />
        )}
      </section>
    </div>
  );
};

export default MarketView;
