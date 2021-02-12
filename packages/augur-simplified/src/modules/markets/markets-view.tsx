import React, { useEffect, useState } from 'react';
import Styles from './markets-view.styles.less';
import { AppViewStats, NetworkMismatchBanner } from '../common/labels';
import { FilterIcon } from '../common/icons';
import classNames from 'classnames';
import { SearchButton, SecondaryButton } from '../common/buttons';
import { SquareDropdown } from '../common/selection';
import { useAppStatusStore } from '../stores/app-status';
import { MarketInfo } from '../types';
import {
  SIDEBAR_TYPES,
  ALL_CURRENCIES,
  ALL_MARKETS,
  categoryItems,
  currencyItems,
  marketStatusItems,
  OPEN,
  OTHER,
  POPULAR_CATEGORIES_ICONS,
  sortByItems,
  TOTAL_VOLUME,
  DEFAULT_MARKET_VIEW_SETTINGS,
  ENDING_SOON,
  RESOLVED,
  IN_SETTLEMENT,
  LIQUIDITY,
  MARKET_STATUS,
  TWENTY_FOUR_HOUR_VOLUME,
  CREATE,
  MODAL_ADD_LIQUIDITY,
} from '../constants';
import { sliceByPage, Pagination } from '../common/pagination';
import { TopBanner } from '../common/top-banner';
import { searchMarkets } from '../apollo/client';
import { SearchInput } from '../common/inputs';
import { LoadingMarketCard, MarketCard } from './market-card';
import { useGraphDataStore } from '../stores/graph-data';

const PAGE_LIMIT = 21;

const applyFiltersAndSort = (
  passedInMarkets,
  setFilteredMarkets,
  {
    filter,
    categories,
    sortBy,
    currency,
    reportingState,
    showLiquidMarkets,
    showInvalidMarkets,
  },
  handleGraphError
) => {
  searchMarkets(filter, (err, searchedMarkets) => {
    if (err) handleGraphError(err);
    let updatedFilteredMarkets = passedInMarkets;

    if (filter !== '') {
      updatedFilteredMarkets = updatedFilteredMarkets.filter(
        (market) => searchedMarkets.indexOf(market.marketId) !== -1
      );
    }

    updatedFilteredMarkets = updatedFilteredMarkets.filter(
      (market: MarketInfo) => {
        if (
          showLiquidMarkets &&
          (!market.amm ||
            isNaN(market?.amm?.liquidityUSD) ||
            !market?.amm?.liquidityUSD)
        ) {
          return false;
        }
        if (!showInvalidMarkets && market.isInvalid) {
          return false;
        }
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
        if (currency !== ALL_CURRENCIES) {
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
        } else if (reportingState === RESOLVED) {
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
        return (marketB?.amm?.volumeTotalUSD || 0) >
          (marketA?.amm?.volumeTotalUSD || 0)
          ? 1
          : -1;
      } else if (sortBy === TWENTY_FOUR_HOUR_VOLUME) {
        return (marketB?.amm?.volume24hrTotalUSD || 0) >
          (marketA?.amm?.volume24hrTotalUSD || 0)
          ? 1
          : -1;
      } else if (sortBy === LIQUIDITY) {
        return (marketB?.amm?.liquidityUSD || 0) >
          (marketA?.amm?.liquidityUSD || 0)
          ? 1
          : -1;
      } else if (sortBy === ENDING_SOON) {
        return marketA?.endTimestamp < marketB?.endTimestamp ? 1 : -1;
      }
      return true;
    });
    if (sortBy !== ENDING_SOON) {
      updatedFilteredMarkets = updatedFilteredMarkets
        .filter((m) => m.amm !== null)
        .concat(updatedFilteredMarkets.filter((m) => m.amm === null));
    }
    setFilteredMarkets(updatedFilteredMarkets);
  });
};

const MarketsView = () => {
  const {
    isMobile,
    isLogged,
    marketsViewSettings,
    actions: { setSidebar, updateMarketsViewSettings, setModal },
    settings: { showLiquidMarkets, showInvalidMarkets },
  } = useAppStatusStore();
  const {
    blocknumber,
    ammExchanges,
    cashes,
    markets,
    actions: { updateGraphHeartbeat },
  } = useGraphDataStore();
  const { sortBy, categories, reportingState, currency } = marketsViewSettings;
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filteredMarkets, setFilteredMarkets] = useState([]);
  const [filter, setFilter] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    document.getElementById('mainContent')?.scrollTo(0, 0);
    window.scrollTo(0, 1);
  }, [page]);

  useEffect(() => {
    if (Object.values(markets).length > 0) {
      setLoading(false);
    }
    setPage(1);
    applyFiltersAndSort(
      Object.values(markets),
      setFilteredMarkets,
      {
        filter,
        categories,
        sortBy,
        currency,
        reportingState,
        showLiquidMarkets,
        showInvalidMarkets,
      },
      (err) =>
        updateGraphHeartbeat(
          { ammExchanges, cashes, markets },
          blocknumber,
          err
        )
    );
  }, [
    sortBy,
    filter,
    categories,
    reportingState,
    currency,
    showLiquidMarkets.valueOf(),
    showInvalidMarkets,
  ]);

  useEffect(() => {
    if (Object.values(markets).length > 0) {
      setLoading(false);
    }
    applyFiltersAndSort(
      Object.values(markets),
      setFilteredMarkets,
      {
        filter,
        categories,
        sortBy,
        currency,
        reportingState,
        showLiquidMarkets,
        showInvalidMarkets,
      },
      (err) =>
        updateGraphHeartbeat(
          { ammExchanges, cashes, markets },
          blocknumber,
          err
        )
    );
  }, [markets]);

  useEffect(() => {
    // initial render only.
    document.getElementById('mainContent')?.scrollTo(0, 0);
    window.scrollTo(0, 1);
  }, []);

  let changedFilters = 0;

  Object.keys(DEFAULT_MARKET_VIEW_SETTINGS).forEach((setting) => {
    if (marketsViewSettings[setting] !== DEFAULT_MARKET_VIEW_SETTINGS[setting])
      changedFilters++;
  });

  const handleNoLiquidity = (market: MarketInfo) => {
    const { amm } = market;
    if (!amm && isLogged) {
      setModal({
        type: MODAL_ADD_LIQUIDITY,
        market,
        liquidityModalType: CREATE,
        currency: amm?.cash?.name,
      });
    }
  };

  return (
    <div
      className={classNames(Styles.MarketsView, {
        [Styles.SearchOpen]: showFilter,
      })}
    >
      <NetworkMismatchBanner />
      {isLogged ? <AppViewStats showCashAmounts /> : <TopBanner />}
      {isMobile && (
        <div>
          <SecondaryButton
            text={`filters${changedFilters ? ` (${changedFilters})` : ``}`}
            icon={FilterIcon}
            action={() => setSidebar(SIDEBAR_TYPES.FILTERS)}
          />
          <SearchButton
            action={() => {
              setFilter('');
              setShowFilter(!showFilter);
            }}
            selected={showFilter}
          />
        </div>
      )}
      <ul>
        <SquareDropdown
          onChange={(value) => {
            updateMarketsViewSettings({ categories: value });
          }}
          options={categoryItems}
          defaultValue={categories}
        />
        <SquareDropdown
          onChange={(value) => {
            updateMarketsViewSettings({ sortBy: value });
          }}
          options={sortByItems}
          defaultValue={sortBy}
        />
        <SquareDropdown
          onChange={(value) => {
            updateMarketsViewSettings({ reportingState: value });
          }}
          options={marketStatusItems}
          defaultValue={reportingState}
        />
        <SquareDropdown
          onChange={(value) => {
            updateMarketsViewSettings({ currency: value });
          }}
          options={currencyItems}
          defaultValue={currency}
        />
        <SearchButton
          selected={showFilter}
          action={() => {
            setFilter('');
            setShowFilter(!showFilter);
          }}
        />
      </ul>
      {showFilter && (
        <SearchInput
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          clearValue={() => setFilter('')}
        />
      )}
      {loading ? (
        <section>
          {new Array(PAGE_LIMIT).fill(null).map((m, index) => (
            <LoadingMarketCard key={index} />
          ))}
        </section>
      ) : filteredMarkets.length > 0 ? (
        <section>
          {sliceByPage(filteredMarkets, page, PAGE_LIMIT).map(
            (market, index) => (
              <MarketCard
                key={`${market.marketId}-${index}`}
                market={market}
                handleNoLiquidity={handleNoLiquidity}
                noLiquidityDisabled={!isLogged}
              />
            )
          )}
        </section>
      ) : (
        <span className={Styles.EmptyMarketsMessage}>
          No markets to show. Try changing the filter options.
        </span>
      )}
      {filteredMarkets.length > 0 && (
        <Pagination
          page={page}
          itemCount={filteredMarkets.length}
          itemsPerPage={PAGE_LIMIT}
          action={(page) => {
            setPage(page);
          }}
          updateLimit={null}
        />
      )}
    </div>
  );
};

export default MarketsView;
