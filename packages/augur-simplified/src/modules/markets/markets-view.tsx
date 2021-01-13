import React, { useEffect, useState } from 'react';
import Styles from 'modules/markets/markets-view.styles.less';
import {
  SIDEBAR_TYPES,
  ALL,
  ALL_MARKETS,
  categoryItems,
  currencyItems,
  ETH,
  marketStatusItems,
  OPEN,
  OTHER,
  POPULAR_CATEGORIES_ICONS,
  sortByItems,
  TOTAL_VOLUME,
} from 'modules/constants';
import { MarketLink } from 'modules/routes/helpers/links';
import {
  ValueLabel,
  AppViewStats,
  CategoryLabel,
  CategoryIcon,
} from 'modules/common/labels';
import { formatDai, formatPercent } from 'utils/format-number';
import { EthIcon, FilterIcon, UsdIcon } from 'modules/common/icons';
import classNames from 'classnames';
import { PrimaryButton, SecondaryButton } from 'modules/common/buttons';
import { SquareDropdown } from 'modules/common/selection';
import { Pagination } from 'modules/common/pagination';
import { useAppStatusStore } from 'modules/stores/app-status';
import { AmmExchange, MarketInfo } from '../types';
import {
  DEFAULT_MARKET_VIEW_SETTINGS,
  ENDING_SOON,
  FINALIZED,
  IN_SETTLEMENT,
  LIQUIDITY,
  MARKET_STATUS,
  MODAL_ADD_LIQUIDITY,
  TWENTY_FOUR_HOUR_VOLUME,
  USDC,
} from '../constants';
import { NetworkMismatchBanner, ReportingStateLabel } from '../common/labels';

const PAGE_LIMIT = 20;

const LoadingMarketCard = () => {
  return (
    <article className={Styles.LoadingMarketCard}>
      <div>
        <div />
        <div />
        <div />
      </div>
      <div>
        <div />
        <div />
        <div />
      </div>
      <div>
        <div />
        <div />
        <div />
      </div>
    </article>
  );
};

const OutcomesTable = ({ amm }: { amm: AmmExchange }) => {
  return (
    <div className={Styles.OutcomesTable}>
      {amm &&
        amm?.ammOutcomes &&
        amm.ammOutcomes
          .filter(outcome => !outcome.isInvalid)
          .map(outcome => (
            <div key={`${outcome.name}-${amm?.marketId}-${outcome.id}`}>
              <span>{outcome.name.toLowerCase()}</span>
              <span>
                {amm?.liquidity !== '0' ? formatDai(outcome.price).full : '-'}
              </span>
            </div>
          ))}
    </div>
  );
};

const MarketCard = ({ market }: { market: MarketInfo }) => {
  const {
    categories,
    description,
    outcomes,
    marketId,
    amm,
    reportingState,
  } = market;
  const formattedApy = amm?.apy && formatPercent(amm.apy).full;
  const {
    actions: { setModal },
  } = useAppStatusStore();

  return (
    <article
      className={classNames(Styles.MarketCard, {
        [Styles.NoLiquidity]: !amm,
      })}
      onClick={() =>
        amm
          ? null
          : setModal({
              type: MODAL_ADD_LIQUIDITY,
              market,
              currency: amm?.cash?.name,
            })
      }
    >
      <MarketLink id={marketId} dontGoToMarket={!amm} ammId={amm?.id}>
        <div>
          <CategoryIcon categories={categories} />
          <CategoryLabel categories={categories} />
          <div>
            <ReportingStateLabel {...{ reportingState }} />
            {amm?.cash?.name === ETH && EthIcon}
            {amm?.cash?.name === USDC && UsdIcon}
          </div>
          <span>{description}</span>
          {!amm ? (
            <div>
              <span>Market requires Initial liquidity</span>
              <PrimaryButton text="Earn fees as a liquidity provider" />
            </div>
          ) : (
            <>
              <ValueLabel
                label="total volume"
                value={formatDai(market.amm?.volumeTotalUSD).full}
              />
              <ValueLabel label="APY" value={formattedApy} />
              <OutcomesTable amm={amm} outcomes={outcomes} />
            </>
          )}
        </div>
      </MarketLink>
    </article>
  );
};

const getOffset = page => {
  return (page - 1) * PAGE_LIMIT;
};

const applyFiltersAndSort = (
  passedInMarkets,
  setFilteredMarkets,
  { categories, sortBy, currency, reportingState }
) => {
  let updatedFilteredMarkets = passedInMarkets;
  updatedFilteredMarkets = updatedFilteredMarkets.filter(
    (market: MarketInfo) => {
      if (
        categories !== ALL_MARKETS &&
        categories !== OTHER &&
        market.categories[0].toLowerCase() !== categories.toLowerCase()
      ) {
        return false;
      }
      if (
        categories === OTHER &&
        POPULAR_CATEGORIES_ICONS[market.categories[0].toLowerCase()]
      ) {
        return false;
      }
      if (currency !== ALL) {
        if (!market.amm) {
          return false;
        } else if (market?.amm?.cash?.name !== currency) {
          return false;
        }
      }
      if (reportingState === OPEN) {
        if (market.reportingState !== MARKET_STATUS.TRADING) {
          return false;
        }
      } else if (reportingState === IN_SETTLEMENT) {
        if (
          market.reportingState !== MARKET_STATUS.REPORTING &&
          market.reportingState !== MARKET_STATUS.DISPUTING
        )
          return false;
      } else if (reportingState === FINALIZED) {
        if (
          market.reportingState !== MARKET_STATUS.FINALIZED &&
          market.reportingState !== MARKET_STATUS.SETTLED
        )
          return false;
      }
      return true;
    }
  );
  updatedFilteredMarkets = updatedFilteredMarkets.sort((marketA, marketB) => {
    if (sortBy === TOTAL_VOLUME) {
      return (
        marketB?.amm?.volumeTotalUSD -
        marketA?.amm?.volumeTotalUSD
      );
    } else if (sortBy === TWENTY_FOUR_HOUR_VOLUME) {
      return (
        marketB?.amm?.volume24hrTotalUSD -
        marketA?.amm?.volume24hrTotalUSD
      );
    } else if (sortBy === LIQUIDITY) {
      return (
        marketB?.amm?.liquidityUSD - marketA?.amm?.liquidityUSD
      );
    } else if (sortBy === ENDING_SOON) {
      return (
        marketB?.amm?.endTimestamp - marketA?.amm?.endTimestamp
      );
    }
    return true;
  });
  setFilteredMarkets(updatedFilteredMarkets);
};

const MarketsView = () => {
  const {
    isMobile,
    marketsViewSettings,
    actions: { setSidebar, updateMarketsViewSettings },
    processed: { markets },
  } = useAppStatusStore();
  const { sortBy, categories, reportingState, currency } = marketsViewSettings;
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filteredMarkets, setFilteredMarkets] = useState([]);

  useEffect(() => {
    if (Object.values(markets).length > 0) setLoading(false);
    setPage(1);
    applyFiltersAndSort(Object.values(markets), setFilteredMarkets, {
      categories,
      sortBy,
      currency,
      reportingState,
    });
  }, [sortBy, categories, reportingState, currency, markets]);

  useEffect(() => {
    // initial render only.
    document.getElementById('mainContent')?.scrollTo(0, 0);
    window.scrollTo(0, 1);
  }, []);

  let changedFilters = 0;

  Object.keys(DEFAULT_MARKET_VIEW_SETTINGS).map(setting => {
    if (marketsViewSettings[setting] !== DEFAULT_MARKET_VIEW_SETTINGS[setting])
      changedFilters++;
  });

  return (
    <div className={Styles.MarketsView}>
      <NetworkMismatchBanner />
      <AppViewStats showCashAmounts />
      {isMobile && (
        <SecondaryButton
          text={`filters${changedFilters ? ` (${changedFilters})` : ``}`}
          icon={FilterIcon}
          action={() => setSidebar(SIDEBAR_TYPES.FILTERS)}
        />
      )}
      <ul>
        <SquareDropdown
          onChange={value => {
            updateMarketsViewSettings({ categories: value });
          }}
          options={categoryItems}
          defaultValue={categories}
        />
        <SquareDropdown
          onChange={value => {
            updateMarketsViewSettings({ sortBy: value });
          }}
          options={sortByItems}
          defaultValue={sortBy}
        />
        <SquareDropdown
          onChange={value => {
            updateMarketsViewSettings({ reportingState: value });
          }}
          options={marketStatusItems}
          defaultValue={reportingState}
        />
        <SquareDropdown
          onChange={value => {
            updateMarketsViewSettings({ currency: value });
          }}
          options={currencyItems}
          defaultValue={currency}
        />
      </ul>
      <section>
        {loading &&
          new Array(PAGE_LIMIT)
            .fill(null)
            .map((m, index) => <LoadingMarketCard key={index} />)}
        {!loading &&
          filteredMarkets.length > 0 && filteredMarkets
            .slice(getOffset(page), getOffset(page) + PAGE_LIMIT)
            .map((market, index) => (
              <MarketCard key={`${market.marketId}-${index}`} market={market} />
            ))}
      </section>
      {filteredMarkets.length === 0 &&
        <span className={Styles.EmptyMarketsMessage}>
          No markets to show. Try changing the filter options.
        </span>
      }
      {filteredMarkets.length > 0 && <Pagination
        page={page}
        itemCount={filteredMarkets.length}
        itemsPerPage={PAGE_LIMIT}
        action={page => {
          setPage(page);
        }}
        updateLimit={null}
      />}
    </div>
  );
};

export default MarketsView;
