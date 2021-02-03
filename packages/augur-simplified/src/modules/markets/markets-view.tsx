import React, { useEffect, useState } from 'react';
import Styles from './markets-view.styles.less';
import { MarketLink } from '../routes/helpers/links';
import {
  ValueLabel,
  AppViewStats,
  CategoryLabel,
  CategoryIcon,
  CurrencyTipIcon,
  NetworkMismatchBanner,
  ReportingStateLabel,
} from '../common/labels';
import {
  formatCashPrice,
  formatDai,
  formatPercent,
} from '../../utils/format-number';
import { FilterIcon, ConfirmedCheck } from '../common/icons';
import classNames from 'classnames';
import {
  PrimaryButton,
  SearchButton,
  SecondaryButton,
} from '../common/buttons';
import { SquareDropdown } from '../common/selection';
import { useAppStatusStore } from '../stores/app-status';
import { AmmExchange, AmmOutcome, MarketInfo, MarketOutcome } from '../types';
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
  MODAL_ADD_LIQUIDITY,
  TWENTY_FOUR_HOUR_VOLUME,
  CREATE,
} from '../constants';
import { sliceByPage, Pagination } from '../common/pagination';
import { TopBanner } from '../common/top-banner';
import { searchMarkets } from '../apollo/client';
import { SearchInput } from '../common/inputs';

const PAGE_LIMIT = 21;

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
) => combineOutcomeData(ammOutcomes, marketOutcomes).filter(({ payoutNumerator }) => payoutNumerator !== null && payoutNumerator !== '0');

export const outcomesToDisplay = (
  ammOutcomes: AmmOutcome[],
  marketOutcomes: MarketOutcome[]
) => {
  const combinedData = combineOutcomeData(ammOutcomes, marketOutcomes);
  const invalid = combinedData.slice(0, 1);
  const yes = combinedData.slice(2, 3);
  const no = combinedData.slice(1, 2);
  let newOrder = invalid.concat(yes).concat(no).concat(combinedData.slice(3));
  if (
    newOrder[0].isFinalNumerator &&
    newOrder[0].payoutNumerator !== '0' &&
    newOrder[0].payoutNumerator !== null
  ) {
    // invalid is winner -- only pass invalid
    newOrder = invalid;
  } else {
    newOrder = newOrder.filter((outcome) => !outcome.isInvalid);
  }
  return newOrder;
};

const OutcomesTable = ({
  amm,
  marketOutcomes,
}: {
  amm: AmmExchange;
  marketOutcomes: MarketOutcome[];
}) => (
  <div
    className={classNames(Styles.OutcomesTable, {
      [Styles.hasWinner]: marketOutcomes[0].isFinalNumerator,
    })}
  >
    {outcomesToDisplay(amm.ammOutcomes, marketOutcomes).map((outcome) => {
      const isWinner =
        outcome.isFinalNumerator && outcome.payoutNumerator !== '0';
      return (
        <div
          key={`${outcome.name}-${amm?.marketId}-${outcome.id}`}
          className={classNames({ [Styles.WinningOutcome]: isWinner })}
        >
          <span>{outcome.name.toLowerCase()}</span>
          <span>
            {isWinner
              ? ConfirmedCheck
              : outcome.isFinalNumerator
              ? ''
              : amm?.liquidity !== '0'
              ? formatCashPrice(outcome.price, amm?.cash?.name).full
              : '-'}
          </span>
        </div>
      );
    })}
  </div>
);

const MarketCard = ({ market }: { market: MarketInfo }) => {
  const {
    categories,
    description,
    marketId,
    amm,
    reportingState,
    outcomes,
  } = market;
  const formattedApy = amm?.apy && formatPercent(amm.apy).full;
  const {
    isLogged,
    actions: { setModal },
  } = useAppStatusStore();
  return (
    <article
      className={classNames(Styles.MarketCard, {
        [Styles.NoLiquidity]: !amm,
      })}
      onClick={() => {
        if (!amm && isLogged) {
          setModal({
            type: MODAL_ADD_LIQUIDITY,
            market,
            liquidityModalType: CREATE,
            currency: amm?.cash?.name,
          });
        }
      }}
    >
      <div>
        <CategoryIcon categories={categories} />
        <CategoryLabel categories={categories} />
        <div>
          <ReportingStateLabel {...{ reportingState }} />
          <CurrencyTipIcon name={amm?.cash?.name} marketId={marketId} />
        </div>
        {!amm ? (
          <span>{description}</span>
        ) : (
          <MarketLink id={marketId} dontGoToMarket={!amm} ammId={amm?.id}>
            {description}
          </MarketLink>
        )}
        {!amm ? (
          <div>
            <span>Market requires Initial liquidity</span>
            <PrimaryButton
              title={
                isLogged
                  ? 'Earn fees as a liquidity provider'
                  : `Connect an account to earn fees as a liquidity provider`
              }
              disabled={!isLogged}
              text="Earn fees as a liquidity provider"
            />
          </div>
        ) : (
          <>
            <ValueLabel
              label="total volume"
              value={formatDai(market.amm?.volumeTotalUSD).full}
            />
            <ValueLabel label="APY" value={formattedApy} />
            <OutcomesTable amm={amm} marketOutcomes={outcomes} />
          </>
        )}
      </div>
    </article>
  );
};

const applyFiltersAndSort = (
  passedInMarkets,
  setFilteredMarkets,
  paraConfig,
  { filter, categories, sortBy, currency, reportingState, showLiquidMarkets },
  handleGraphError
) => {
  searchMarkets(paraConfig, filter, (err, searchedMarkets) => {
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
    blocknumber,
    paraConfig,
    actions: { setSidebar, updateMarketsViewSettings, updateGraphHeartbeat },
    processed,
    settings: { showLiquidMarkets },
  } = useAppStatusStore();
  const { sortBy, categories, reportingState, currency } = marketsViewSettings;
  const { markets } = processed;
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
    if (Object.values(markets).length > 0) setLoading(false);
    setPage(1);
    applyFiltersAndSort(
      Object.values(markets),
      setFilteredMarkets,
      paraConfig,
      {
        filter,
        categories,
        sortBy,
        currency,
        reportingState,
        showLiquidMarkets,
      },
      (err) => updateGraphHeartbeat(processed, blocknumber, err)
    );
  }, [sortBy, filter, categories, reportingState, currency, showLiquidMarkets]);

  useEffect(() => {
    if (Object.values(markets).length > 0) setLoading(false);
    applyFiltersAndSort(
      Object.values(markets),
      setFilteredMarkets,
      paraConfig,
      {
        filter,
        categories,
        sortBy,
        currency,
        reportingState,
        showLiquidMarkets,
      },
      (err) => updateGraphHeartbeat(processed, blocknumber, err)
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
      {loading && (
        <section>
          {new Array(PAGE_LIMIT).fill(null).map((m, index) => (
            <LoadingMarketCard key={index} />
          ))}
        </section>
      )}
      {!loading && filteredMarkets.length > 0 && (
        <section>
          {sliceByPage(filteredMarkets, page, PAGE_LIMIT).map(
            (market, index) => (
              <MarketCard key={`${market.marketId}-${index}`} market={market} />
            )
          )}
        </section>
      )}
      {filteredMarkets.length === 0 && (
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
